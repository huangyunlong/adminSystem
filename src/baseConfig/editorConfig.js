import WangEditor from "wangeditor";

function initEditor(editorNode, customConfig) {
    let editor = new WangEditor(editorNode);
    _.merge(editor.customConfig, {
        onchangeTimeout: 100,
        onchange: (html, text) => {
            // html 即变化之后的内容
        },
        uploadImgShowBase64: true, // 使用 base64 保存图片
        // uploadImgServer:'/upload',  // 图片上传地址
        uploadImgMaxSize: 3 * 1024 * 1024, // 图片上传单张限制大小
        uploadImgMaxLength: 5, // 每次最多上传几张
        uploadImgHooks: {
            before: function (xhr, editor, files) {
                // 图片上传之前触发
                // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件
                // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
                // return {
                //     prevent: true,
                //     msg: '放弃上传'
                // }
            },
            success: function (xhr, editor, result) {
                console.log("success");
                // 图片上传并返回结果，图片插入成功之后触发
                // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
            },
            fail: function (xhr, editor, result) {
                // 图片上传并返回结果，但图片插入错误时触发
                // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
            },
            error: function (xhr, editor) {
                // 图片上传出错时触发
                // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
            },
            timeout: function (xhr, editor) {
                // 图片上传超时时触发
                // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
            }
        },
        menus: [
            "head", // 标题
            "bold", // 粗体
            "fontSize", // 字号
            "fontName", // 字体
            "italic", // 斜体
            "underline", // 下划线
            "strikeThrough", // 删除线
            "foreColor", // 文字颜色
            "backColor", // 背景颜色
            "link", // 插入链接
            "list", // 列表
            "justify", // 对齐方式
            "quote", // 引用
            //   "emoticon", // 表情
            "image", // 插入图片
            "table", // 表格
            //   "video", // 插入视频
            "code", // 插入代码
            "undo", // 撤销
            "redo" // 重复];
        ]
    }, customConfig);
    editor.create();
    return editor;
}

export default {
    initEditor
}