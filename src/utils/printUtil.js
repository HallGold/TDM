import {DomTools} from "vxe-table/lib/tools";
import XEUtils from "xe-utils";

function createFrame() {
    const frame = document.createElement('iframe')
    frame.className = 'vxe-table--print-frame'
    return frame
}


function createBlob(content) {
    let blob = null
    if (window.Blob) {
        blob = new Blob([content], {type: `text/html`})
    }
    return blob;
}

const defaultHtmlStyle = ""

let printFrame

/**
 * 解析value表达式，支持值、函数、引用
 * @param express
 * @param itemsResp
 * @returns {*}
 */
function explainExpress(express, itemsResp) {

    //let express = null
    //传入的是整个配置对象
    /* if (XEUtils.isObject(item) && XEUtils.has("value")) {
         express = item.value;
         let label = item.label;
     } else {
         express = item
     }*/

    if (XEUtils.isFunction(express)) {
        return express()
    }

    if (XEUtils.isString(express) && itemsResp) {
        if (express.startsWith("ref::")) {
            const ref = itemsResp[express.substr(5, express.length - 5)];
            if (ref) {
                const itemInfo = ref.getPrintItemInfo()
                if (itemInfo) {
                    return itemInfo.value
                }
            }

        } else {
            return express
        }
    } else {
        return XEUtils.eqNull(express) ? '' : express
    }

}

/**
 * 解析table引用数据
 * @param express
 * @param itemsResp
 * @param columns
 * @returns {*|{head, data}}
 */
function explainTable(express, itemsResp, columns) {

    if (XEUtils.isString(express) && itemsResp) {
        if (express.startsWith("ref::")) {
            const ref = itemsResp[express.substr(5, express.length - 5)];

            if (ref) {
                return ref.getLabelData(columns.map(item => item.prop))
            }

        }
    }

}

/**
 * 解析表格数据
 * @param head
 * @param data
 * @returns {string}
 */
function createTableElement(head, data, columns) {
    let html = `<table cellspacing="0" cellpadding="5" style="width:100%;height:100%;border-collapse: collapse;border-width:0px; border-style:hidden;">`

    //如果有列配置信息，则按照列清单信息生成列配置
    if (head && columns && columns.length) {
        head = head.map(headItem => {
            const column = columns.find(column => column.prop == headItem.prop)
            if (column) {
                return {
                    ...headItem,
                    width: column.width
                }
            } else {
                return null
            }
        }).filter(item => item)
    }

    if (head) {
        html += "<thead>"
        html += "<tr>"
        head.forEach(column => {
            html += "<th>"
            html += column.title;
            html += "</th>"
        })
        html += "</tr>"
        html += "</thead>"
    } else {
        return "";
    }

    if (data) {
        html += "<tbody>"
        data.forEach(row => {
            html += "<tr>"
            head.forEach(column => {
                html += `<td style='${column.width == 'auto' ? '' : 'width:' + column.width}'>`
                html += row[column.prop] ? row[column.prop] : '';
                html += "</td>"
            })
            html += "</tr>"
        })
        html += "</tbody>"
    }

    html += "</table>"
    return html;
}


function createEmbedHtml(embed, itemsResp) {
    let html = `<table cellspacing="0" cellpadding="5" style="width:100%;height:100%;border-collapse: collapse;border-width:0px; border-style:hidden;">`
    if (embed) {
        html += "<tbody>"
        embed.forEach(row => {
            html += "<tr>"
            row.forEach(cell => {
                html += createCellHtml(cell, itemsResp)
            })
            html += "</tr>"
        })
        html += "</tbody>"
    }

    html += "</table>"
    return html;
}

/**
 * 解析cell
 * @param cell
 * @returns {string}
 */


function createCellHtml(cell, itemsResp) {

    const labelColspan = cell.labelColspan || 3;

    const labelRowspan = cell.labelRowspan || 1;

    const valueColspan = (cell.colspan - labelColspan) || 5;

    const valueRowspan = cell.rowspan || 1;


    const style = cell.style || '';

    let {label, value, type, columns} = cell;

    //修正columns数据
    if (columns && columns.length) {
        columns = columns.map(column => {
            if (XEUtils.isString(column)) {
                return {
                    prop: column,
                    width: 'auto'
                }
            } else {
                return column
            }
        })
    }

    let html = "";

    //判定是否存在label
    if (label) {
        if (!value) {
            html += `<td style='width:${(labelColspan + valueColspan) * 4.166}%;${style}' rowspan='${labelRowspan}'  colspan='${labelColspan + valueColspan}'>`
        } else {
            html += `<td style='width:${(labelColspan) * 4.166}%;text-align: center' rowspan='${labelRowspan}' colspan='${labelColspan}'>`
        }

        html += cell.label
        html += "</td>"
    }

    //判定是否是表格
    if (type === 'table') {

        if (XEUtils.isString(value)) {//字符串需要解析
            value = explainTable(value, itemsResp, columns)
        }

        const {head, data} = value
        if (head || data) {
            html += `<td style='width:${valueColspan * 4.166}%;${style};padding:0' rowspan='${valueRowspan}' colspan='${valueColspan}'>`
            html += createTableElement(head, data, columns)
            html += "</td>"
        }
    } else if (type === 'embed') {
        html += `<td style='width:${valueColspan * 4.166}%;${style};padding:0' rowSpan='${valueRowspan}' colSpan='${valueColspan}'>`
        html += createEmbedHtml(value, itemsResp)
        html += "</td>"
    } else if (type === 'operateInfo') {
        const operateInfo = itemsResp["operateInfo"]
        const {head, data} = operateInfo
        html += `<td style='width:${valueColspan * 4.166}%;${style};padding:0' rowspan='${valueRowspan}' colspan='${valueColspan}'>`
        html += createTableElement(head, data, columns)
        html += "</td>"
    } else if (!value) {

    } else {
        html += `<td style='width:${valueColspan * 4.166}%;${style};' rowSpan='${valueRowspan}' colSpan='${valueColspan}'>`
        html += explainExpress(value, itemsResp)
        html += "</td>"
    }


    return html
}


export default {

    printHtml(html) {
        const content = html
        const blob = createBlob(content)
        if (DomTools.browse.msie) {
            if (printFrame) {
                try {
                    printFrame.contentDocument.write('')
                    printFrame.contentDocument.clear()
                } catch (e) {
                }
                document.body.removeChild(printFrame)
            }
            printFrame = createFrame()
            document.body.appendChild(printFrame)
            printFrame.contentDocument.write(content)
            printFrame.contentDocument.execCommand('print')
        } else {
            if (!printFrame) {
                printFrame = createFrame()
                printFrame.onload = evnt => {
                    if (evnt.target.src) {
                        // console.log("before print")
                        evnt.target.contentWindow.print()
                        //console.log("after print")
                    }
                }
                document.body.appendChild(printFrame)
            }
            printFrame.src = URL.createObjectURL(blob)
        }

    },
    print(opts, itemsResp) {
        this.printHtml(this.toHtml(opts, itemsResp))
    },
    toHtml(opts, itemsResp) {
        const {style, title, titleClass, titleStyle, rows} = opts
        let html = [
            '<html>',
            '<head>',
            `<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,minimal-ui"><title>${title}</title>`,
            `<style>${style || defaultHtmlStyle}</style>`,
            `<style>
                    *{
                        font-size: 10px;
                    }
                    table tr th , table tr td { 
                        border:1px solid #E8EAFC;
                        word-wrap:break-word;
                        word-break:break-all;
                        height:40px;
                        valign:middle;
                        padding: 5px;
                    }
                    table{
                        border-collapse: collapse;
                    }    
                    table thead tr th{
                        background: #F8F8F9;
                    }
            </style>`,
            '</head>',
            '<body>',
            `<table style="width: 100%"  cellspacing="0" cellpadding="0">`,

        ].join('')

        if (title) {
            html += `<caption ${titleClass ? 'class="' + titleClass + '"' : ''} ${titleStyle ? 'style="' + titleStyle + '"' : ''}>${title}</caption>`
        }

        if (rows && rows.length) {
            rows.forEach(row => {
                html += "<tr>"
                row.forEach(cell => {
                    html += createCellHtml(cell, itemsResp)
                })
                html += "</tr>"
            })
        }


        html += `</table></body></html>`;

        return html
    },


}
