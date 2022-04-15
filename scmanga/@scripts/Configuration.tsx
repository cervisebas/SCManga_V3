import AsyncStorage from "@react-native-async-storage/async-storage";

export function getConfigPDF(): Promise<number> {
    return new Promise((resolve)=>{
        AsyncStorage.getItem('ConfigPDF').then((value)=>{
            try {
                if (value !== null) resolve(parseInt(value)); else resolve(0);                
            } catch {
                resolve(0);
            }
        }).catch(()=>resolve(0));
    });
};
export function setConfigPDF(value: string): Promise<boolean> {
    return new Promise((resolve)=>AsyncStorage.setItem('ConfigPDF', value).then(()=>resolve(true)).catch(()=>resolve(false)));
};