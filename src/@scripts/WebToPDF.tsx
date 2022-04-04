import { Download } from './Download';
import { GeneratePDF } from './PDF-Generate';
import { ClearString } from './others';

const download = new Download();
const generatePDF = new GeneratePDF();

export async function WebToPDF(title: string, idName: string, chapter: string, images: string[]) {
    var idDl: string = String(Math.floor(Math.random() * (999 - 1)) + 1);
    var imagesDl = await download.goDownloadTemp(idDl, title, idName, chapter, images);
    await generatePDF.generateLocal3(idDl, `${title} - Capítulo ${chapter}`, `${ClearString(title.toLowerCase()).replace(/\ /gi, '-')}-${chapter}`, imagesDl);
};