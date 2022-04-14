import AsyncStorage from '@react-native-async-storage/async-storage';
import { ItemView } from "../@types/ViewsList";
import moment from "moment";

export class ViewsList {
    constructor() { }
    addItem(url: string) {
        return new Promise(async(resolve)=>{
            if (!await this.findItem(url)) {
                var list = await this.getList();
                var date: string = moment().format("DD/MM/YYYY HH:mm");
                list.push({ url: url, date: date, views: 1 });
                await AsyncStorage.setItem('ViewsListHentai', JSON.stringify(list));
                resolve(true);
            } else {
                var list = await this.getList();
                var date: string = moment().format("DD/MM/YYYY HH:mm");
                var index: number = list.findIndex((value)=>value.url == url);
                list[index] = {
                    url: list[index].url,
                    date: date,
                    views: (list[index].views + 1)
                };
                await AsyncStorage.setItem('ViewsListHentai', JSON.stringify(list));
                resolve(true);
            }
        });
    }
    async findItem(url: string): Promise<boolean> {
        return new Promise(async(resolve, reject)=>{
            try {
                var list = await this.getList();
                var find = list.find((item)=>item.url == url);
                return resolve((find !== undefined)? true : false);
            } catch (error) {
                return reject(error);
            }            
        });
    }
    getItem(url: string): Promise<ItemView | boolean> {
        return new Promise(async(resolve)=>{
            var list = await this.getList();
            var find = list.find((value)=>value.url == url);
            return resolve((find !== undefined)? find : false);
        });
    }
    async getList(): Promise<ItemView[]> {
        var storage = await AsyncStorage.getItem('ViewsListHentai');
        return (storage !== null)? JSON.parse(String(storage)) : [];
    }
}