import pug from 'pug';
import {GetObjectCommand, S3Client} from '@aws-sdk/client-s3';
const config = {
    Region: process.env.REGION,
};
const client = new S3Client(config);
export default async function renderView(
    str: String,
    params: {
        messages: any;
        user: any;
        layoutUser: any;
        errors: any;
        documentTitle: string;
    }
) {
    const input = {
        Bucket: 'membersonlybucket',
        Key: `views/${str}.pug`,
    };
    const viewCommand = new GetObjectCommand(input);
    const viewReq = await client.send(viewCommand);
    const view = await viewReq.Body.transformToString('utf-8');
    const {layoutView, cssData, scriptData} = await getLayout();
    const content = pug.render(view, {
        messages: params.messages,
        errors: params.errors,
        user: params.user,
    });
    const document = pug.render(layoutView, {
        script: scriptData,
        style: cssData,
        documentTitle: params.documentTitle,
        content: content,
        user: params.layoutUser,
    });
    return document;
}

async function getLayout() {
    const layout = {
        Bucket: 'membersonlybucket',
        Key: 'views/layout.pug',
    };
    const css = {
        Bucket: 'membersonlybucket',
        Key: 'css/style.css',
    };
    const script = {
        Bucket: 'membersonlybucket',
        Key: 'js/menu.js',
    };
    const layoutCommand = new GetObjectCommand(layout);
    const layoutReq = await client.send(layoutCommand);
    const layoutView = await layoutReq.Body.transformToString('utf-8');
    const cssCommand = new GetObjectCommand(css);
    const cssReq = await client.send(cssCommand);
    const cssData = await cssReq.Body.transformToString('utf-8');
    const scriptCommand = new GetObjectCommand(script);
    const scriptReq = await client.send(scriptCommand);
    const scriptData = await scriptReq.Body.transformToString('utf-8');
    return {layoutView, cssData, scriptData};
}
