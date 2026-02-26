import React, { useState, useEffect } from 'react';
import { Upload, Button } from 'antd';
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { getLocator } from '../../../core/utils';
import { FieldLayout } from '../FieldLayout';

const { Dragger } = Upload;

function triggerChange(onChange, changedValue) {
    if (onChange) onChange([...changedValue]);
}

export function UploadItems({ wrapperProps, inputProps, formItem, auth, item, value, onChange, changed }) {
    const [files, setFiles] = useState([]);
    useEffect(() => {
        triggerChange(onChange, files);
    }, [files]);

    const uploadingProps = {
        maxCount: 10,
        name: 'files',
        multiple: true,
        showUploadList: item.showUploadList,
        accept: item.accept,
        onRemove: (file) => {
            const index = files.indexOf(file);
            const newFiles = files.slice();
            newFiles.splice(index, 1);
            setFiles(newFiles);
        },
        beforeUpload: (file) => {
            setFiles(o => [...o, file]);
            return false;
        },
        fileList: files,
    };
    return (
        <Upload
            {...uploadingProps}
            data-locator={getLocator(item?.name)}
            {...inputProps}
            {...item?.inputProps}
        >
            {!item.trigger && (
                <Button data-locator={getLocator(item?.name, "upload")} icon={<UploadOutlined />}>
                    Загрузить файлы
                </Button>
            )}
            {item?.trigger?.()}
        </Upload>
    );
}

export function UploadItem({ wrapperProps, inputProps, formItem, auth, item, value, onChange, changed }) {
    const [files, setFiles] = useState([]);
    useEffect(() => {
        triggerChange(onChange, files);
    }, [files]);

    const uploadingProps = {
        maxCount: 1,
        name: 'file',
        multiple: false,
        showUploadList: item.showUploadList,
        accept: item.accept,
        onRemove: (file) => {
            const index = files.indexOf(file);
            const newFiles = files.slice();
            newFiles.splice(index, 1);
            setFiles(newFiles);
        },
        beforeUpload: (file) => {
            setFiles([file]);
            return false;
        },
        fileList: files,
    };
    const content = (it) => (
        <div style={{ padding: "15px" }}>
            <p className="ant-upload-drag-icon" style={{ marginBottom: "12px" }}>
                <InboxOutlined />
            </p>
            <p className="ant-upload-text" style={{ fontSize: "14px" }}>
                Нажмите для выбора или перетащите файл <br />в выделенную область
            </p>
            <p className="ant-upload-hint" style={{ fontSize: "13px" }}>
                {it.accept ? "Поддерживается загрузка файлов " + it.accept : "Поддерживается загрузка любых типов файлов"}
            </p>
        </div>
    );
    return (
        <Dragger
            {...uploadingProps}
            data-locator={getLocator(item?.name)}
            {...inputProps}
            {...item?.inputProps}
        >
            {item.trigger && (
                <div>
                    {item.trigger()}
                    {!item.nocontent && (
                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: "rgb(240 248 255 / 82%)",
                                display: !value ? "flex" : "none",
                                justifyContent: "center",
                                alignContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <div style={{ padding: "15px", borderRadius: "4px", backgroundColor: "rgb(255 255 255 / 67%)" }}>
                                {content(item)}
                            </div>
                        </div>
                    )}
                </div>
            )}
            {!item.trigger && content(item)}
        </Dragger>
    );
}
