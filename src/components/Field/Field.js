import React from 'react';
import { useUIOptional } from '../../adapters/UIContext';
import { useMetaContext } from '../../Context';

export function Field(props) {
    const {
        auth,
        item,
        value,
        onChange,
        // mode,
        // disabled,
        // placeholder,
    } = props;

    const meta = useMetaContext();
    console.log("Field", meta)

    if (props?.item?.render) {
        return props.item.render(auth, item, value, onChange, props);
    }

    const ui = useUIOptional();
    if (!ui || !ui.renderField) {
        return null;
    }

    return ui.renderField(props);

    // const type = item?.view?.type ?? item?.type;

    // switch (item.filterType) {
    //     case "group":
    //         switch (type) {
    //             case "func":
    //                 return props?.item?.render
    //                     ? props.item.render(auth, item, value, onChange, context )
    //                     : undefined;
    //             case "object":
    //             case "document":
    //                 return <GroupObj {...context} />;
    //             default:
    //                 return <Unknown {...context} />;
    //         }
    //     case "range":
    //         switch (type) {
    //             case "func":
    //                 return props?.item?.render
    //                     ? props.item.render(auth, item, value, onChange, context)
    //                     : undefined;
    //             case "int":
    //             case "uint":
    //             case "integer":
    //             case "int64":
    //             case "int32":
    //             case "uint64":
    //             case "uint32":
    //                 return <RangeInteger {...context} />;
    //             case "double":
    //             case "float":
    //             case "float64":
    //             case "float32":
    //                 return <RangeFloat {...context} />;
    //             case "time":
    //                 return <RangeTime {...context} />;
    //             case "date":
    //                 return <RangeDate {...context} />;
    //             case "datetime":
    //             case "time.Time":
    //                 return <RangeDateTime {...context} />;
    //             default:
    //                 return <Unknown {...context} />;
    //         }
    //     case "slider":
    //         switch (type) {
    //             case "func":
    //                 return props?.item?.render
    //                     ? props.item.render(auth, item, value, onChange, context)
    //                     : undefined;
    //             case "int":
    //             case "uint":
    //             case "integer":
    //             case "int64":
    //             case "int32":
    //             case "uint64":
    //             case "uint32":
    //                 return <IntegerSlider {...context} />;
    //             case "double":
    //             case "float":
    //             case "float64":
    //             case "float32":
    //                 return <FloatSlider {...context} />;
    //             default:
    //                 return <Unknown {...context} />;
    //         }
    //     default:
    //         switch (type) {
    //             case "func":
    //                 return props?.item?.render
    //                     ? props.item.render(auth, item, value, onChange, context)
    //                     : undefined;
    //             case "text":
    //                 return <MultilineText {...context} />;
    //             case "string":
    //                 return <String {...context} />;
    //             case "password":
    //                 return <Password {...context} />;
    //             case "int":
    //             case "uint":
    //             case "integer":
    //             case "int64":
    //             case "int32":
    //             case "uint64":
    //             case "uint32":
    //                 return <Integer {...context} />;
    //             case "double":
    //             case "float":
    //             case "float64":
    //             case "float32":
    //                 return <Float {...context} />;
    //             case "boolean":
    //             case "bool":
    //                 return <Boolean {...context} />;
    //             case "time":
    //                 return <Time {...context} />;
    //             case "date":
    //                 return <Date {...context} />;
    //             case "datetime":
    //             case "time.Time":
    //                 return <DateTime {...context} />;
    //             case "collection":
    //                 return <ObjCollection {...context} />;
    //             case "object":
    //             case "document":
    //                 return item.mode === "dialog" ? <BigObj {...context} /> : <Obj {...context} />;
    //             case "file":
    //                 return <UploadItem {...context} />;
    //             case "files":
    //                 return <UploadItems {...context} />;
    //             case "image":
    //                 return <Image {...context} />;
    //             default:
    //                 return <Unknown {...context} />;
    //         }
    // }
}
