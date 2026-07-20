import error        from "#core/error.ts";
import dotenv       from "#core/env.ts";

import nodePath     from "node:path";
import nodeFs       from "node:fs";
import nodeFsa      from "node:fs/promises";

/**
 * เส้นทางที่อยู่จัดเก็บไฟล์
*/
let PATH: string;
/**
 * ระบบจัดการข้อมูลจัดเก็บ
*/
const content = () =>
{
    return;
}
/**
 * เริ่มต้นการทำงานของระบบ
*/
content.init = async () =>
{
    const root = process.cwd ();
    const rel = dotenv.getString ("B_STORAGE_PATH", "/data/storage");
    const resolved = nodePath.resolve (nodePath.join (root, rel));

    PATH = resolved;

    await nodeFsa.mkdir (PATH).catch (() => { return; })
    return Promise.resolve ();
}
/**
 * ยุติการทำงานของระบบ
 */
content.terminate = () =>
{
    return;
}
/**
 * รับเส้นทางที่อยู่ของทรัพยากรทั้งหมด
*/
content.getPath = () =>
{
    return PATH;
}
/**
 * เชื่อมต่อเส้นทางที่อยู่ของทรัพยากร
*/
content.getJoin = (other: ResourcePath) =>
{
    return nodePath.resolve (nodePath.join (PATH, other));
}
content.createReader = async (id: ResourceId, start: number, end: number) =>
{
    const resId = id;
    const resPath = content.getJoin (resId);

    if (!resPath.startsWith (PATH))
    {
        throw new error.NotFound ();
    }
    const stat = await nodeFsa.stat (resPath).catch ((e: unknown) =>
    {
        throw new error.NotFound (e);
    })
    .then ((x) =>
    {
        if (x.isFile ())
        {
            return x;
        }
        throw new error.NotFound ();
    })

    const posStart = Number.isFinite (start) ? start : 0;
    const posEnd = Number.isFinite (end) ? end : stat.size;

    return {
        stream: nodeFs.createReadStream (resPath, {
            autoClose: true,
            start: posStart,
            end: posEnd
        }),
        start: posStart,
        end: posEnd,
        totalOffset: posEnd - posStart,
        totalSize: stat.size, 
    }
}
content.createWriter = async (data: Uint8Array) : Promise<ResourceId> =>
{
    let filepath: string;
    let filename: string;

    for (;;)
    {
        const uuid = crypto.randomUUID ();
        const path = content.getJoin (uuid);
        const available = await nodeFsa.stat (path).then (() =>
        {
            return false;
        })
        .catch (() =>
        {
            return true;
        });

        if (available) 
        {
            filepath = path;
            filename = uuid;
            break;
        }
    }

    await nodeFsa.writeFile (filepath, data, {
        encoding: "binary",
    });
    return filename;
}
content.createWriterId = async () =>
{
    for (;;)
    {
        const uuid = crypto.randomUUID ();
        const path = content.getJoin (uuid);
        const available = await nodeFsa.stat (path).then (() =>
        {
            return false;
        })
        .catch (() =>
        {
            return true;
        });

        if (available) 
        {
            return uuid;
        }
    }
}
content.createWriterPath = async () : Promise<ResourcePath> =>
{
    return content.getJoin (await content.createWriterId ());
}
content.delete = (id: ResourceId) =>
{
    try
    {
        return nodeFsa.rm (content.getJoin (id), { force: true });
    }
    catch 
    {
        return Promise.resolve ();
    }
}

content.getMime = function (path: string)
{
    const resId = path;
    const resPath = content.getJoin (resId);

    if (!resPath.startsWith (PATH))
    {
        throw new error.NotFound ();
    }
    const ext = resPath.lastIndexOf ('.');
    const value = ext === -1 ? resPath : resPath.substring (ext).toLowerCase ();

    switch (value)
    {
        case ".txt":        return "text/plain";
        case ".md":         return "text/markdown";
        case ".log":        return "text/plain";
        case ".properties": return "text/plain";

        case ".bat":        return "text/plain";
        case ".ps1":        return "text/plain";
        case ".sh":         return "text/plain";
        case ".c":          return "text/plain";
        case ".cxx":        return "text/plain";
        case ".cs":         return "text/plain";
        case ".vb":         return "text/plain";
        case ".py":         return "text/plain";
        case ".js":         return "text/plain";
        case ".ts":         return "text/plain";
        case ".rs":         return "text/plain";
        case ".zig":        return "text/plain";

        case ".json":       return "text/json";
        case ".xml":        return "text/xml";
        case ".yml":        return "application/yaml";
        case ".yaml":       return "application/yaml";

        case ".pdf":        return "application/pdf";
        case ".doc":        return "application/msword";
        case ".docx":       return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

        case ".jpg":        return "image/jpeg";
        case ".jpeg":       return "image/jpeg";
        case ".png":        return "image/png";
        case ".bmp":        return "image/bmp";

        case ".gif":        return "image/gif";

        case ".mp4":        return "video/mp4";
        case ".mkv":        return "video/matroska";
        case ".mov":        return "video/quicktime";
        case ".flv":        return "video/x-flv";

        case ".exe":        return "vnd.microsoft.portable-executable";

        case ".zip":        return "application/zip";
        case ".rar":        return "application/vnd.rar";
        case ".tar":        return "application/x-tar";
        case ".gz":         return "application/gzip";
        case ".gzip":       return "application/gzip";
        case ".7z":         return "application/x-7z-compressed";

        case ".flac":       return "audio/flac";
        case ".wav":        return "audio/wav";
        case ".opus":       return "audio/opus";
        case ".ogg":        return "audio/ogg";
        case ".mp3":        return "audio/mpeg";
        // case ".m4a":        return "audio/mp4";
        // case ".wma":        return "audio/wma";

        default:
            return "";
    }
}
content.delete = async (path: string) =>
{
    const resId = path;
    const resPath = content.getJoin (resId);

    if (!resPath.startsWith (PATH))
    {
        throw new error.NotFound ();
    }
    await nodeFsa.rm (resPath);
    return;
}
export type ResourcePath = string;
export type ResourceId = string;
/**
 * ส่งออกตัวแปร
*/
export default content;