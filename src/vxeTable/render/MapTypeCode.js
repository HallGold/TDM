import VXETable from "vxe-table";
import XEUtils from "xe-utils";

VXETable.renderer.add("mapTypeCode", {
    renderEdit(h, renderOpts, params) {
        let {row, column} = params
        return [
            <ice-select {...{
                model: {
                    value: XEUtils.get(row, column.property, ""),
                    callback(value) {
                        XEUtils.set(row, column.property, value)
                    }
                },
                props: renderOpts
            }}>
            </ice-select>
        ]
    },
    renderCell(h, renderOpts, params) {

        let mapTypeCode = "";
        let type = 1;
        if (renderOpts.mapTypeCode) {
            mapTypeCode = renderOpts.mapTypeCode;
            type = 1;
        } else {
            mapTypeCode = renderOpts.cusMapTypeCode;
            type = 2;
        }
        let {row, column} = params;
        let obj = {
            mapTypeCode,
            type
        }
        // type 1 mapTypeCode 2 cusMapTypeCode
        return [
            <ice-datamap-translater value={XEUtils.get(row, column.property, "")} mapTypeCode={obj}>
            </ice-datamap-translater>
        ]
    },
    renderDefault: (h, renderOpts, params) => {
        let mapTypeCode = "";
        let type = 1;
        if (renderOpts.mapTypeCode) {
            mapTypeCode = renderOpts.mapTypeCode;
            type = 1;
        } else {
            mapTypeCode = renderOpts.cusMapTypeCode;
            type = 2;
        }
        let {row, column} = params;
        let obj = {
            mapTypeCode,
            type
        }

        return [
            <ice-datamap-translater value={XEUtils.get(row, column.property, "")} mapTypeCode={obj}>
            </ice-datamap-translater>
        ]
    }
});
