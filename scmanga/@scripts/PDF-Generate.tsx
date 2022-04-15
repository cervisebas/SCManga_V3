import RNFS from 'react-native-fs';
import notifee, { AndroidGroupAlertBehavior } from '@notifee/react-native';
import { NativeModules, PermissionsAndroid } from 'react-native';
import ImageResizer from 'react-native-image-resizer';
import { Download } from './Download';
import { Image } from 'react-native';
import { ClearString } from './others';
import { getConfigPDF } from './Configuration';

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
                var config = await getConfigPDF();
                this.convertAction(config, images, idDl, title, filename);
            }, 1500);
        } catch (error) {
            console.log(error);
            await this.notificationWithOutProgress(idDl, `No se pudo convertir: ${title}`, 'Ocurrió un error al procesar la conversión.', false);
        }
    }

    convertAction(option: number, images: string[], idDl: string, title: string, filename: string) {
        switch (option) {
            case 0:
                this.getWidthAndHeight(images, idDl, title).then(async(values)=>{
                    await this.notification(idDl, `Conviertiendo: ${title}`, 'Generando...', 0, 1, true, true);
                    const options = {
                        imagePaths: images,
                        name: `${filename}.pdf`,
                        maxSize: { width: values.width, height: values.height },
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
                break;
            case 1:
                this.getWidthAndHeight2(images, idDl, title).then(async(values)=>{
                    try {
                        await this.notification(idDl, `Conviertiendo: ${title}`, 'Generando...', 0, 1, true, true);
                        const options = {
                            imagePaths: values.images,
                            name: `${filename}.pdf`,
                            maxSize: { width: values.width, height: values.height },
                            quality: 1,
                            targetPathRN: RNFS.DownloadDirectoryPath
                        };
                        const pdf = await RNImageToPdf.createPDFbyImages(options);
                        await RNFS.moveFile(pdf.filePath, `${RNFS.DownloadDirectoryPath}/${filename}.pdf`);
                        for (let i = 0; i < values.images.length; i++) {
                            RNFS.unlink(values.images[i]);
                        }
                        await this.notificationWithOutProgress(idDl, `Conversión completa: ${title}`, 'Guardado en la carpeta descargas.', false);
                    } catch (error) {
                        console.log(error);
                        await this.notificationWithOutProgress(idDl, `No se pudo convertir: ${title}`, 'Ocurrió un error al procesar la conversión.', false);
                    }
                }).catch(async(error)=>{
                    console.log(error);
                    await this.notificationWithOutProgress(idDl, `No se pudo convertir: ${title}`, 'Ocurrió un error al procesar la conversión.', false);
                });
                break;
            case 2:
                this.getWidthAndHeight3(images, idDl, title).then(async(values)=>{
                    try {
                        await this.notification(idDl, `Conviertiendo: ${title}`, 'Generando...', 0, 1, true, true);
                        const options = {
                            imagePaths: values.images,
                            name: `${filename}.pdf`,
                            maxSize: { width: values.width, height: values.height },
                            quality: 0.8,
                            targetPathRN: RNFS.DownloadDirectoryPath
                        };
                        const pdf = await RNImageToPdf.createPDFbyImages(options);
                        await RNFS.moveFile(pdf.filePath, `${RNFS.DownloadDirectoryPath}/${filename}.pdf`);
                        for (let i = 0; i < values.images.length; i++) {
                            RNFS.unlink(values.images[i]);
                        }
                        await this.notificationWithOutProgress(idDl, `Conversión completa: ${title}`, 'Guardado en la carpeta descargas.', false);
                    } catch (error) {
                        console.log(error);
                        await this.notificationWithOutProgress(idDl, `No se pudo convertir: ${title}`, 'Ocurrió un error al procesar la conversión.', false);
                    }
                }).catch(async(error)=>{
                    console.log(error);
                    await this.notificationWithOutProgress(idDl, `No se pudo convertir: ${title}`, 'Ocurrió un error al procesar la conversión.', false);
                });
                break;
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
    getWidthAndHeight2(srcs: string[], idDl: string, title: string): Promise<{ width: number; height: number; images: string[]; }> {
        return new Promise(async(resolve, reject)=>{
            try {
                var width: number = 0;
                var sizesImages: { w: number; h: number; }[] = [];
                for (let i = 0; i < srcs.length; i++) {
                    await this.notification(idDl, `Leyendo: ${title}`, 'Procesando...', i, srcs.length, false, true);
                    var size = await this.getSizeImage(srcs[i]);
                    width = (size.w > width)? size.w: width;
                    sizesImages.push({ w: size.w, h: size.h });
                }
                var height3: number = 0;
                var images: string[] = [];
                for (let i = 0; i < srcs.length; i++) {
                    await this.notification(idDl, `Reescalando: ${title}`, 'Procesando...', i, srcs.length, false, true);
                    var resize = await this.resizeImage2(srcs[i], sizesImages[i].w, sizesImages[i].h, Math.floor(width), sizesImages[i].h);
                    height3 += resize.height;
                    images.push(resize.source);
                }
                resolve({ width: width, height: height3, images });
            } catch (error) {
                reject(error);
            }
        });
    }
    getWidthAndHeight3(srcs: string[], idDl: string, title: string): Promise<{ width: number; height: number; images: string[]; }> {
        return new Promise(async(resolve, reject)=>{
            try {
                var width: number = 0;
                var height: number = 0;
                var sizesImages: { w: number; h: number; }[] = [];
                var images: string[] = [];
                for (let i = 0; i < srcs.length; i++) {
                    await this.notification(idDl, `Leyendo: ${title}`, 'Procesando...', i, srcs.length, false, true);
                    var size = await this.getSizeImage(srcs[i]);
                    width = (size.w > width)? size.w: width;
                    height += size.h;
                    sizesImages.push({ w: size.w, h: size.h });
                }
                for (let i = 0; i < srcs.length; i++) {
                    await this.notification(idDl, `Reescalando: ${title}`, 'Procesando...', i, srcs.length, false, true);
                    var resize = await this.resizeImage3(srcs[i], sizesImages[i].w, sizesImages[i].h);
                    images.push(resize.source);
                }
                resolve({ width, height, images });
            } catch (error) {
                reject(error);
            }
        });
    }
    
    
    
    
    resizeImage2(src: string, imageWidth: number, imageHeight: number, refWidth: number, refHeight: number): Promise<{ width: number; height: number; source: string; }> {
        return new Promise(async(resolve, reject)=>{
            try {
                var size = this.resizeImage(imageWidth, imageHeight, refWidth, refHeight);
                var output = `${RNFS.ExternalCachesDirectoryPath}/images-${Math.floor(Math.random() * (999999 - 111111) + 111111)}-cache.png`;
                ImageResizer.createResizedImage(src, size.width, size.height, 'PNG', 100, undefined, undefined, false, undefined).then(async(value)=>{
                    await RNFS.moveFile(value.path, output);
                    resolve({ width: size.width, height: size.height, source: output });
                }).catch((error)=>reject(error));
            } catch (error) {
                reject(error);
            }
        });
    }
    resizeImage3(src: string, imageWidth: number, imageHeight: number): Promise<{ source: string; }> {
        return new Promise(async(resolve, reject)=>{
            try {
                var output = `${RNFS.ExternalCachesDirectoryPath}/images-${Math.floor(Math.random() * (999999 - 111111) + 111111)}-cache.png`;
                ImageResizer.createResizedImage(src, imageWidth, imageHeight, 'PNG', 80, undefined, undefined, false, undefined).then(async(value)=>{
                    await RNFS.moveFile(value.path, output);
                    resolve({ source: output });
                }).catch((error)=>reject(error));
            } catch (error) {
                reject(error);
            }
        });
    }
    getSizeImage(src: string): Promise<{ w: number; h: number; }> {
        return new Promise((resolve, reject)=>Image.getSize(`file://${src}`, (w, h)=>resolve({ w, h }), (error)=>reject(error)));
    }
    resizeImage(imageWidth: number, imageHeight: number, refWidth: number, refHeight: number): { width: number; height: number } {
        var proportion = imageWidth/imageHeight;
        if (refHeight * proportion < refWidth) {
            return { width: refWidth, height: refWidth / proportion };
        } else {
            return { width: refHeight * proportion, height: refHeight };
        }
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
                color: '#F4511E',
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
                color: '#F4511E',
                onlyAlertOnce: false,
                autoCancel: true,
                ongoing: ongoing
            }
        });
    }

    async generateLocal3(idDl: string, title: string, filename: string, images: string[]) {
        try {
            await this.notification(idDl, `Conviertiendo: ${title}`, 'Espere...', 0, 1, true, true);
            var access = await this.checkPermisions();
            if (!access) return await this.notificationWithOutProgress(idDl, `No se pudo convertir: ${title}`, 'Ocurrió un error al procesar la conversión.', false);
            setTimeout(async()=>{
                await this.notification(idDl, `Conviertiendo: ${title}`, 'Generando...', 0, 1, true, true);
                var config = await getConfigPDF();
                this.convertAction(config, images, idDl, title, filename);
            }, 1500);
        } catch (error) {
            console.log(error);
            await this.notificationWithOutProgress(idDl, `No se pudo convertir: ${title}`, 'Ocurrió un error al procesar la conversión.', false);
        }
    }
}