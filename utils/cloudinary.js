const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: 'rtbckl',
    api_key: '933441431759377',
    api_secret: 'pybyDGzxdCE74RQtgxhEfQXqRj8',
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