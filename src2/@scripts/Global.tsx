import React, { useContext } from "react";
import { Portal } from "react-native-paper";
import LoadingController from '../@assets/loading/loading-controller';
import { Info } from "../@types/ViewInfo";
import { ViewInfoManga3 } from '../ViewInfoManga/ViewInfoManga';
import { ImageView3 } from './ImageView';
import { ImageViewManga2 } from './ImageViewManga';
import { ImageViewMangaLocal } from './ImageViewMangaLocal';
import { ViewMangas } from '../ViewInfoManga/ViewMangas';
import { CombinedDarkTheme, CombinedDefaultTheme, StyleDark, StylesDefaults, themeDefault } from "../Styles";
import { ViewGenders } from '../ViewGenders/ViewGenders';
import { popular } from "../@types/ApiManga";
import { MaterialDialog } from "react-native-material-dialog";
import { Text, ToastAndroid } from "react-native";
import { ViewMangasLocal } from "../ViewInfoManga/ViewMangasLocal";
import { PreferencesContext } from './PreferencesContext';

interface IProps {
    /* Information */
    infoView: boolean;
    infoData: Info;
    infoFlipListChapter: boolean;
    infoClose: ()=>any;

    /* View Manga */
    vMangaSources: string[];
    vMangaView: boolean;
    vMangaViewLocal: boolean;
    vMangaTitle: string;
    vMangaChapter: string;
    vMangaClose: ()=>any;

    /* View Image */
    vImageSrc: string;
    vImageView: boolean;
    vImageClose: ()=>any;

    /* View Images Manga */
    vImagesMangaSources: string;
    vImagesMangaView: boolean;
    vImagesMangaViewLocal: boolean;
    vImagesMangaClose: ()=>any;

    /* Loading View */
    loadingView: boolean;
    loadingText: string;

    /* Genders View */
    vGenderGender: string;
    vGenderView: boolean;
    vGenderTitle: string;
    vGenderPages: number;
    vGenderList: popular[];
    vGenderClose: ()=>any;

    /* Alert */
    alertView: boolean;
    errorCode: number;
    errorData: string;
    alertClose: ()=>any;

    /* Functions */
    goToChapter: (url: string, title: string, chapter: string, resolve: ()=>any)=>any;
    goToChapterLocal: (index: number, title: string, resolve: ()=>any)=>any;
    goOpenImageViewer: (urlImage: string)=>any;
    goOpenImageViewer2: (urlImage: string)=>any;
    goOpenImageViewerLocal: (urlImage: string)=>any;
    goInfoManga: (url: string, resolve: ()=>any)=>any;
    refreshInfoManga: ()=>any;
    stateTab3ViewGenderList: (state: boolean)=>any;
    actionLoading: (visible: boolean, text?: string)=>any;
    goVGenderList: (gender: string, title: string)=>any;
    flipChapters: ()=>any;
};

export function Global2(props: IProps) {
    const { isThemeDark } = useContext(PreferencesContext);
    const retryProcess = ()=>{
        console.log(`\n ${props.errorData}`);
        switch (props.errorCode) {
            case 1:
                var data = JSON.parse(props.errorData);
                props.goToChapter(data.url, data.title, data.chapter, ()=>{return;});
                break;
            case 2:
                props.goInfoManga(props.errorData, ()=>{return;});
                break;
            case 3:
                var data = JSON.parse(props.errorData);
                props.goVGenderList(data.gender, data.title);
                break;
            default:
                ToastAndroid.show('No se pudo reintentar.', ToastAndroid.SHORT);
                break;
        }
    };

    return(
        <Portal theme={themeDefault}>
            <MaterialDialog
                visible={props.alertView}
                title={"Oh no :("}
                colorAccent={CombinedDarkTheme.colors.accent}
                cancelLabel="Cerrar"
                onCancel={()=>props.alertClose()}
                okLabel="Reintentar"
                backgroundColor={(isThemeDark)? CombinedDarkTheme.colors.onSurface: CombinedDefaultTheme.colors.onSurface}
                titleColor={(isThemeDark)? CombinedDarkTheme.colors.text: CombinedDefaultTheme.colors.text}
                onOk={()=>{props.alertClose();retryProcess();}}
            >
                <Text style={{ color: (isThemeDark)? StyleDark.subtitleColor: StylesDefaults.subtitleColor }}>
                    Ocurrió un error inesperado durante la carga de la información.{'\n\n'}
                    Pulsa en “Cerrar” para ignorar esta alerta o “Reintentar” para volver a intentar la operación.
                </Text>
            </MaterialDialog>
            <LoadingController
                show={props.loadingView}
                loadingText={props.loadingText}
                borderRadius={8}
                indicatorColor={'#f4511e'}
            />
            <ViewInfoManga3
                visible={props.infoView}
                data={props.infoData}
                clickViewImage={(src: string)=>props.goOpenImageViewer2(src)}
                close={()=>props.infoClose()}
                clickGoToChapter={(url: string, title: string, chapter: string)=>props.goToChapter(url, title, chapter, ()=>props.refreshInfoManga())}
                goVGenderList={(gender: string, title: string)=>props.goVGenderList(gender, title)}
                flipChapters={()=>props.flipChapters()}
                isFlipList={props.infoFlipListChapter}
            />
            <ViewMangas
                images={props.vMangaSources}
                visible={props.vMangaView}
                title={props.vMangaTitle}
                information={{
                    title: props.infoData.title,
                    cover: props.infoData.image,
                    idName: props.infoData.url.replace('https://leermanga.net/manga/', ''),
                    chapter: props.vMangaChapter
                }}
                openImage={(img: string)=>props.goOpenImageViewer2(img)}
                close={()=>props.vMangaClose()}
            />
            <ViewMangasLocal
                images={props.vMangaSources}
                visible={props.vMangaViewLocal}
                title={props.vMangaTitle}
                openImage={(img: string)=>props.goOpenImageViewerLocal(img)}
                close={()=>props.vMangaClose()}
            />
            <ImageView3
                image={props.vImageSrc}
                visible={props.vImageView}
                dissmiss={()=>props.vImageClose()}
            />
            <ImageViewManga2
                image={props.vImagesMangaSources}
                visible={props.vImagesMangaView}
                dissmiss={()=>props.vImagesMangaClose()}
            />
            <ImageViewMangaLocal
                image={props.vImagesMangaSources}
                visible={props.vImagesMangaViewLocal}
                dissmiss={()=>props.vImagesMangaClose()}
            />
            <ViewGenders
                visible={props.vGenderView}
                gender={props.vGenderGender}
                close={()=>props.vGenderClose()}
                title={props.vGenderTitle}
                list={props.vGenderList}
                pages={props.vGenderPages}
                goInfoManga={(url: string)=>props.goInfoManga(url, ()=>{})}
            />
        </Portal>
    );
}