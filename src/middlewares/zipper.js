import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import archiver from "archiver";
import fs from "fs";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
    endpoint: process.env.SPACE_URL,
    forcePathStyle: false,
    region: process.env.SPACE_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const getImageFromSpace = async (bucketName, objectKey) => {
    const params = {
        Bucket: bucketName,
        Key: objectKey,
    };

    try {
        const data = await s3Client.send(new GetObjectCommand(params));
        return data.Body; // Return the image binary data
    } catch (error) {
        console.error("Error retrieving the image from Spaces:", error);
        throw error;
    }
};

const getImageFromSpaceToEdit = async (bucketName, objectKey) => {
    const params = {
        Bucket: bucketName,
        Key: objectKey,
    };

    try {
        const data = await s3Client.send(new GetObjectCommand(params));
        const buffer = await new Promise((resolve, reject) => {
            const chunks = [];
            data.Body.on('data', chunk => chunks.push(chunk));
            data.Body.on('error', reject);
            data.Body.on('end', () => resolve(Buffer.concat(chunks)));
        });
        return buffer; // Return the image binary data as a Buffer
    } catch (error) {
        console.error("Error retrieving the image from Spaces:", error);
        throw error;
    }
};

const getImageUrlFromSpace = async (bucketName, objectKey) => {
    const params = {
        Bucket: bucketName,
        Key: `transactionProofs/${objectKey}`,
        Expires: 1000
    }

    console.log(objectKey, " OBJECT KEY")

    try {
        const url = await getSignedUrl(s3Client, new GetObjectCommand(params));
        console.log(url, " URL")
        return url // Return the signed URL

    } catch (error) {
        console.error("Error retrieving the image URL from Spaces:", error);
        return null;
    }
}
const getEditedImagesUrl = async (bucketName, objectKey) => {
    const params = {
        Bucket: bucketName,
        Key: objectKey.editedPath,
        Expires: 20000
    }

    console.log(objectKey, " OBJECT KEY")

    try {
        const url = await getSignedUrl(s3Client, new GetObjectCommand(params));
        console.log(url, " URL")
        return {
            url,
            _id: objectKey._id,
            objectKey: objectKey.name,
            editedKey: objectKey.editedPath,
            createdAt: objectKey.createdAt
        }

    } catch (error) {
        console.error("Error retrieving the image URL from Spaces:", error);
        return null;
    }
}

const getLogoUrlFromSpace = async (bucketName, objectKey) => {
    const params = {
        Bucket: bucketName,
        Key: objectKey,
        Expires: 100000
    }

    try {
        const url = await getSignedUrl(s3Client, new GetObjectCommand(params));
        console.log(url, " URL")
        return url // Return the signed URL

    } catch (error) {
        console.error("Error retrieving the image URL from Spaces:", error);
        return null;
    }
}

const getBorderUrlFromSpace = async (bucketName, objectKey) => {
    const params = {
        Bucket: bucketName,
        Key: objectKey,
        Expires: 100000
    }

    console.log(objectKey, " OBJECT KEY")

    try {
        const url = await getSignedUrl(s3Client, new GetObjectCommand(params));
        console.log(url, " URL")
        return url // Return the signed URL
    } catch (error) {
        console.error("Error retrieving the image URL from Spaces:", error);
        return null;
    }
}

const getQRCodeFromSpace = async (bucketName, objectKey) => {
    const params = {
        Bucket: bucketName,
        Key: objectKey,
        Expires: 10000
    };

    try {
        const url = await getSignedUrl(s3Client, new GetObjectCommand(params));
        return url;
    } catch (error) {
        console.error("Error retrieving the image from Spaces:", error);
        throw error;
    }
}



const getImagesFromSpace = async (bucketName, objectKey) => {
    const params = {
        Bucket: bucketName,
        Key: objectKey,
        Expires: 1000
    }

    console.log(objectKey, " OBJECT KEY")

    try {
        const url = await getSignedUrl(s3Client, new GetObjectCommand(params));
        console.log(url, " URL")
        return url // Return the signed URL

    } catch (error) {
        console.error("Error retrieving the image URL from Spaces:", error);
        return null;
    }

}

const getWebpUrlFromSpace = async (bucketName, objectKey, createdAt) => {
    const params = {
        Bucket: bucketName,
        Key: objectKey.name.replace(/^tripsImages\/(.+?)\.[^.]+$/, "compressed/$1.webp"),
        Expires: 200000
    }

    try {
        const url = await getSignedUrl(s3Client, new GetObjectCommand(params));
        console.log(url)
        return {
            url,
            _id: objectKey._id,
            objectKey: objectKey.name,
            createdAt: objectKey.createdAt
        }; // Return the signed URL

    } catch (error) {
        console.error("Error retrieving the image URL from Spaces:", error);
        return null;
    }

}
const getDisplayImageForClient = async (bucketName, objectKey, createdAt) => {
    const params = {
        Bucket: bucketName,
        Key: objectKey.name,
        Expires: 200000
    }

    try {
        const url = await getSignedUrl(s3Client, new GetObjectCommand(params));
        console.log(url)
        return {
            url,
            _id: objectKey._id,
            objectKey: objectKey.name,
            createdAt: objectKey.createdAt
        }; // Return the signed URL

    } catch (error) {
        console.error("Error retrieving the image URL from Spaces:", error);
        return null;
    }

}
const getTransactionWebp = async (bucketName, objectKey, createdAt) => {
    const params = {
        Bucket: bucketName,
        Key: objectKey.editedKey,
        Expires: 200000
    }

    try {
        const url = await getSignedUrl(s3Client, new GetObjectCommand(params));
        console.log(url)
        return {
            url,
            _id: objectKey._id,
            objectKey: objectKey.name,
            createdAt: objectKey.createdAt,
            editedKey: objectKey.editedKey,
            size: objectKey.size,
        }; // Return the signed URL

    } catch (error) {
        console.error("Error retrieving the image URL from Spaces:", error);
        return null;
    }

}

const getFile = async (bucketName, objectKey) => {
    const params = {
        Bucket: bucketName,
        Key: objectKey,
    };

    try {
        const data = await s3Client.send(new GetObjectCommand(params));
        const buffer = await new Promise((resolve, reject) => {
            const chunks = [];
            data.Body.on('data', chunk => chunks.push(chunk));
            data.Body.on('error', reject);
            data.Body.on('end', () => resolve(Buffer.concat(chunks)));
        });
        return buffer; 
    } catch (error) {
        console.error("Error retrieving the image from Spaces:", error);
        throw error;
    }
}

const zipImages = async (images) => {
    const zipFilePath = "images.zip";
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver("zip", {
        zlib: { level: 9 }, // Maximum compression level
    });

    return new Promise((resolve, reject) => {
        output.on("close", () => {
            console.log(archive.pointer() + " total bytes");
            console.log(
                "archiver has been finalized and the output file descriptor has closed."
            );
            resolve(zipFilePath);
        });

        archive.on("error", (err) => {
            reject(err);
        });

        archive.pipe(output);
        images.forEach((imageData, index) => {
            console.log("Adding image to zip file");
            archive.append(imageData, { name: `image_${index}.jpg` }); // Change the extension based on your image type
        });
        archive.finalize();
    });
};

export {getDisplayImageForClient,getTransactionWebp, getEditedImagesUrl, getFile, getImageFromSpaceToEdit, getLogoUrlFromSpace, getBorderUrlFromSpace, getQRCodeFromSpace, getImageFromSpace, zipImages, getImageUrlFromSpace, getWebpUrlFromSpace, getImagesFromSpace };
