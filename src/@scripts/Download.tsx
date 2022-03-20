import RNFS, { mkdir, ExternalDirectoryPath, downloadFile, exists, writeFile, readFile, unlink } from 'react-native-fs';
import notifee, { AndroidGroupAlertBehavior } from '@notifee/react-native';
import DeviceInfo from "react-native-device-info";
import { PermissionsAndroid } from 'react-native';

type JSON_File = {
    title: string;
    chapter: string;
    idName: string;
    cover_file: string;
    images_files: string[];
};

var notifs: number = 0;
var showGroup: boolean = false;

export class Download {
    constructor() {
        setTimeout(async()=>{
            this.channel1 = await notifee.createChannel({
                id: 'scmanga_channel',
                name: 'Descargas',
                badge: false
            });
            this.showMoreInfo = (await DeviceInfo.getApiLevel() < 26)? false: true;
        });
        setInterval(()=>{
            if (notifs > 1) {
                if (!showGroup) this.createGroup(true);
            } else if (showGroup) {
                this.createGroup(false);
            }
        }, 512);
    }
    private channel1: string = '';
    private showMoreInfo: boolean = true;

    async goDownload(title: string, idName: string, chapter: string, cover: string, images: string[]) {
        var idDl: string = String(Math.floor(Math.random() * (999 - 1)) + 1);
        await this.notification(idDl, `Descargando: ${title}`, `Capítulo ${chapter}`, 0, images.length, true, true);
        var access = await this.checkPermisions();
        if (!access) return await this.notificationWithOutProgress(idDl, `Ocurrio un error al descargar: ${title}`, `Capitulo ${chapter}`, false);
        notifs += 1;
        try {
            await mkdir(`${ExternalDirectoryPath}/${idName}-${chapter}`);
            var coverDl: string = await this.download(cover, `${idName}-${chapter}/cover.jpg`);
            var imagesDl: string[] = [];
            for (let i = 0; i < images.length; i++) {
                await this.notification(idDl, `Descargando: ${title}`, `Capitulo ${chapter}`, i, images.length, false, true);
                imagesDl.push(await this.download(images[i], `${idName}-${chapter}/image-${i}.jpg`));
            }
            var json: JSON_File = { title: title, chapter: chapter, idName: idName, cover_file: coverDl, images_files: imagesDl };
            await this.setJsonFile(json);
            await this.notificationWithOutProgress(idDl, `Descarga finalizada: ${title}`, `Capitulo ${chapter}`, false);
        } catch (error) {
            await this.notificationWithOutProgress(idDl, `Ocurrio un error al descargar: ${title}`, `Capitulo ${chapter}`, false);
            notifs -= 1;
            console.log(error);
        }
    }

    private jsonFile: string = `${ExternalDirectoryPath}/list_downloads.json`;

    download(uri: string, name: string): Promise<string> {
        return new Promise(async(resolve, reject)=>{
            var options: RNFS.DownloadFileOptions = { fromUrl: uri, toFile: `${ExternalDirectoryPath}/${name}` };
            downloadFile(options).promise.then(()=>resolve(options.toFile)).catch((reason)=>reject(reason));
        });
    }
    getJsonExist(): Promise<JSON_File[]> {
        return new Promise(async(resolve)=>{
            if (await exists(this.jsonFile)) {
                var json = await readFile(this.jsonFile);
                resolve(JSON.parse(json));
            } else {
                resolve([]);
            }
        });
    }
    async createGroup(show: boolean) {
        if (show) {
            showGroup = true;
            return (this.showMoreInfo)? await notifee.displayNotification({
                id: '1001',
                title: 'Descargas en progreso',
                subtitle: `${notifs} descargas`,
                android: {
                  channelId: this.channel1,
                  groupSummary: true,
                  groupId: '1000',
                  groupAlertBehavior: AndroidGroupAlertBehavior.SUMMARY,
                  onlyAlertOnce: true
                }
            }) : await notifee.displayNotification({
                id: '1001',
                title: 'Descargas en progreso',
                android: {
                  channelId: this.channel1,
                  groupSummary: true,
                  groupId: '1000',
                  groupAlertBehavior: AndroidGroupAlertBehavior.SUMMARY,
                  onlyAlertOnce: true
                }
            });
        } else {
            showGroup = false;
            return await notifee.cancelNotification('1001');
        }
    }
    async setJsonFile(jsonString: JSON_File) {
        var jsonExist = await this.getJsonExist();
        jsonExist.push(jsonString);
        if (await exists(this.jsonFile)) await unlink(this.jsonFile);
        return await writeFile(this.jsonFile, JSON.stringify(jsonExist));
    }

    async notification(id: string, title: string, body: string, progress: number, maxProgress: number, indeterminate: boolean, ongoing: boolean) {
        return (this.showMoreInfo)? await notifee.displayNotification({
            id: id,
            title: title,
            subtitle: `${Math.floor((progress/maxProgress)*100)}%`,
            body: body,
            android: {
                channelId: this.channel1,
                groupId: '1000',
                groupAlertBehavior: AndroidGroupAlertBehavior.SUMMARY,
                smallIcon: 'scmanga_icon',
                color: '#F4511E',
                onlyAlertOnce: true,
                ongoing: ongoing,
                autoCancel: false,
                progress: { max: maxProgress, current: progress, indeterminate: indeterminate },
            }
        }) : await notifee.displayNotification({
            id: id,
            title: title,
            body: `${body} - ${Math.floor((progress/maxProgress)*100)}%`,
            android: {
                channelId: this.channel1,
                groupId: '1000',
                groupAlertBehavior: AndroidGroupAlertBehavior.SUMMARY,
                smallIcon: 'scmanga_icon',
                color: '#F4511E',
                onlyAlertOnce: true,
                ongoing: ongoing,
                autoCancel: false,
                progress: { max: maxProgress, current: progress, indeterminate: indeterminate }
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
                smallIcon: 'scmanga_icon',
                color: '#F4511E',
                onlyAlertOnce: false,
                autoCancel: true,
                ongoing: ongoing
            }
        });
    }
    async deleteDownload(index: number) {
        return new Promise(async(resolve)=>{
            var idRm: string = String(Math.floor(Math.random() * (999 - 1)) + 1);
            await this.notification(idRm, 'Borrando un elemento...', 'Espere...', 0, 1, true, true);
            try {
                var json = await this.getJsonExist();
                var data = json[index];
                await this.notification(idRm, `Borrando: ${data.title}`, `Capítulo ${data.chapter}`, 0, data.images_files.length, true, true);
                await unlink(data.cover_file);
                for (let i = 0; i < data.images_files.length; i++) {
                    await this.notification(idRm, `Borrando: ${data.title}`, `Capítulo ${data.chapter}`, i, data.images_files.length, false, true);
                    await unlink(data.images_files[i]);
                }
                await this.notification(idRm, `Borrando: ${data.title}`, `Capítulo ${data.chapter}`, 0, 1, true, true);
                await unlink(`${ExternalDirectoryPath}/${data.idName}-${data.chapter}`);
                var newJson = json.filter((item, i)=>i !== index);
                await unlink(this.jsonFile);
                await writeFile(this.jsonFile, JSON.stringify(newJson));
                await this.notificationWithOutProgress(idRm, `Borrado exitoso: ${data.title}`, `Capítulo ${data.chapter}`, false);
            } catch (error) {
                console.log(error);
                await this.notificationWithOutProgress(idRm, 'Ocurrio un error...', 'Algo salio mal durante una operacion de borrado', false);
            }
            return resolve(true);
        });
    }

    async checkPermisions() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: "Se requieren permisos para seguir",
                    message: "Se requieren permisos del almacenamiento para seguir con la descarga.",
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
}