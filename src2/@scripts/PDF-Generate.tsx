import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS, { readFile } from 'react-native-fs';
import notifee, { AndroidGroupAlertBehavior } from '@notifee/react-native';
import { Download } from './Download';
import { Image } from 'react-native';

const download = new Download();

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
        await this.generateLocal(`${data.title} - Capítulo ${data.chapter}`, data.images_files);
    }

    async generateLocal(title: string, images: string[]) {
        var idDl: string = String(Math.floor(Math.random() * (999 - 1)) + 1);
        try {
            var html: string = '';
            var width: number = 0;
            var height: number = 0;
            await this.notification(idDl, `Conviertiendo: ${title}`, 'Espere...', 0, 1, true, true);
            for (let i = 0; i < images.length; i++) {
                await this.notification(idDl, `Conviertiendo: ${title}`, 'Procesando...', i, images.length, false, true);
                await Image.getSize(`file://${images[i]}`, (ImageW, ImageH) => { height += ImageH; width = (width < ImageW)? ImageW: width; });
                html += `<img style="width: 100%;" src="data:image/jpeg;base64,${await RNFS.readFile(images[i], 'base64')}">`;
            }
            await this.notification(idDl, `Conviertiendo: ${title}`, 'Generando...', 0, 1, true, true);
            await RNHTMLtoPDF.convert({
                html: `<div style="display: flex;width: 100%;height: auto;flex-direction: column;">${html}</div>`,
                fileName: title,
                directory: 'PDFS',
                width: width,
                height: height
            });
            await this.notificationWithOutProgress(idDl, `Conversión completa: ${title}`, 'Guardado en la carpeta descargas.', false);
        } catch (error) {
            await this.notificationWithOutProgress(idDl, `No se pudo convertir: ${title}`, 'Ocurrió un error al procesar la conversión.', false);
        }
        return true;
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