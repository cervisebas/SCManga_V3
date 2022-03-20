import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS, { readFile } from 'react-native-fs';
import notifee, { AndroidGroupAlertBehavior } from '@notifee/react-native';
import { NativeModules, PermissionsAndroid } from 'react-native';
import { Download } from './Download';
import { Image } from 'react-native';
import { ClearString } from './others';

const download = new Download();
const { RNImageToPdf } = NativeModules;

export class GeneratePDF {
    constructor() {
        setTimeout(async()=>{
            this.channel1 = await notifee.createChannel({
                id: 'scmanga_channel',
                name: 'Descargas',
                badge: false
            });
        });
    }
    private channel1: string = '';
    async goGenerateLocal(index: number) {
        var json = await download.getJsonExist();
        var data = json[index];
        await this.generateLocal2(`${data.title} - Capítulo ${data.chapter}`, `${ClearString(data.title.toLowerCase()).replace(/\ /gi, '-')}-${data.chapter}`, data.images_files);
    }
    
    async generateLocal2(title: string, filename: string, images: string[]) {
        var idDl: string = String(Math.floor(Math.random() * (999 - 1)) + 1);
        try {
            await this.notification(idDl, `Conviertiendo: ${title}`, 'Espere...', 0, 1, true, true);
            var access = await this.checkPermisions();
            if (!access) return await this.notificationWithOutProgress(idDl, `No se pudo convertir: ${title}`, 'Ocurrió un error al procesar la conversión.', false);
            setTimeout(async()=>{
                await this.notification(idDl, `Conviertiendo: ${title}`, 'Generando...', 0, 1, true, true);
                this.getWidthAndHeight(images, idDl, title).then(async(values)=>{
                    await this.notification(idDl, `Conviertiendo: ${title}`, 'Generando...', 0, 1, true, true);
                    const options = {
                        imagePaths: images,
                        name: `${filename}.pdf`,
                        maxSize: {
                            width: values.width,
                            height: values.height,
                        },
                        quality: 1,
                        targetPathRN: RNFS.DownloadDirectoryPath
                    };
                    const pdf = await RNImageToPdf.createPDFbyImages(options);
                    await RNFS.moveFile(pdf.filePath, `${RNFS.DownloadDirectoryPath}/${filename}.pdf`);
                    await this.notificationWithOutProgress(idDl, `Conversión completa: ${title}`, 'Guardado en la carpeta descargas.', false);
                }).catch(async(error)=>{
                    console.log(error);
                    await this.notificationWithOutProgress(idDl, `No se pudo convertir: ${title}`, 'Ocurrió un error al procesar la conversión.', false);
                });
            }, 1500);
        } catch (error) {
            console.log(error);
            await this.notificationWithOutProgress(idDl, `No se pudo convertir: ${title}`, 'Ocurrió un error al procesar la conversión.', false);
        }
    }

    getWidthAndHeight(srcs: string[], idDl: string, title: string): Promise<{ width: number; height: number; }> {
        return new Promise(async(resolve, reject)=>{
            try {
                var width: number = 0;
                var height: number = 0;
                for (let i = 0; i < srcs.length; i++) {
                    var size = await this.getSizeImage(srcs[i]);
                    width = (size.w > width)? size.w: width;
                    height += size.h;
                    await this.notification(idDl, `Conviertiendo: ${title}`, 'Procesando...', i, srcs.length, false, true);
                }
                resolve({ width: width, height: height });
            } catch (error) {
                reject(error);
            }
        });
    }
    getSizeImage(src: string): Promise<{ w: number; h: number; }> {
        return new Promise((resolve, reject)=>Image.getSize(`file://${src}`, (w, h)=>resolve({ w, h }), (error)=>reject(error)));
    }

    async checkPermisions() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: "Se requieren permisos para seguir",
                    message: "Se requieren permisos del almacenamiento para seguir con la conversión.",
                    buttonNeutral: "Más tarde",
                    buttonNegative: "Cancelar",
                    buttonPositive: "Aceptar"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }

    async notification(id: string, title: string, body: string, progress: number, maxProgress: number, indeterminate: boolean, ongoing: boolean) {
        return await notifee.displayNotification({
            id: id,
            title: title,
            subtitle: `${Math.floor((progress/maxProgress)*100)}%`,
            body: body,
            android: {
                channelId: this.channel1,
                groupId: 'scmanga',
                groupAlertBehavior: AndroidGroupAlertBehavior.SUMMARY,
                smallIcon: 'scmanga_icon',
                color: '#FC0293',
                onlyAlertOnce: true,
                ongoing: ongoing,
                autoCancel: false,
                progress: {
                    max: maxProgress,
                    current: progress,
                    indeterminate: indeterminate
                }
            }
        });
    }
    async notificationWithOutProgress(id: string, title: string, body: string, ongoing: boolean) {
        return await notifee.displayNotification({
            id: id,
            title: title,
            body: body,
            android: {
                channelId: this.channel1,
                groupId: 'scmanga',
                groupAlertBehavior: AndroidGroupAlertBehavior.SUMMARY,
                smallIcon: 'scmanga_icon',
                color: '#FC0293',
                onlyAlertOnce: false,
                autoCancel: true,
                ongoing: ongoing
            }
        });
    }
}