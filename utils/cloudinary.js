const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: 'rtbckl',
    api_key: '917256578329972',
    api_secret: process.env.CLDNRY_SECRET,
    secure: true,
})


const uploadImage = async (file) => {
    const options = {
        folder: 'Focal',
    }
    try {
        const result = await cloudinary.uploader.upload(file, options)
        return result.secure_url
    } catch (error) {
        console.error(error)
    }
}

module.exports = uploadImage