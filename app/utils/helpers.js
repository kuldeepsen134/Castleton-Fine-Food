const nodemailer = require('nodemailer')
const { Media } = require('../models')

exports.handleError = (error, req, res, status = 0) => {
    // console.log('errorerrorerrorerror', error)
    if (error.details) {
        error.details.map((item) => {
            res.status(400).send({
                message: [item.message.replace(/"/g, '')],
                error: true,
                status
            })
        })
        return
    }


    res.status(400).send({
        error: true,
        message: error.error ? error.error.message : error.errors ? error.errors.map(e => e.message) : error?.original?.sqlMessage ? error?.original?.sqlMessage : error.message ? error : [error],
        status
    })
}

exports.handleResponse = (res, data, message, status = 1) => {

    if (res.req.method === 'POST' || res.req.method === 'PUT' || res.req.method === 'DELETE') {

        res.req.method === 'PUT' || res.req.method === 'DELETE' ? res.status(200).send({ message, error: false, status }) : res.status(200).send({ data, message, error: false, status })
        return
    } else
        res.status(200).send({ ...data, message, status })
};



// Query and filters


exports.handleSearchQuery = (req, fields) => {
    const { Op } = require('sequelize')
    const { filters, q } = req.query
    const query = []

    let queryKeys = fields.map((key) => {
        return {
            [key]: {
                [Op.like]: `%${q}%`
            }
        }
    })

    q && query.push({
        [Op.or]: queryKeys
    })

    for (var key in filters) {
        if (fields.includes(key) && filters[key]) {
            query.push({
                [key]: {
                    [Op.like]: `${filters[key]}`
                }
            })
        }
    }
    return query
}

exports.getPagination = (page, size) => {
    const limit = size ? +size : 5
    const offset = page ? (page - 1) * limit : 0
    return { limit, offset }
}

exports.getPagingResults = (data, page, limit) => {
    const { count: total_items, rows: items } = data
    const current_page = page ? +page : 1
    const total_pages = Math.ceil(total_items / limit)
    const per_page = limit
    return { items, pagination: { total_items, per_page, total_pages, current_page } }
}



exports.generateOTP = () => {
    var digits = '0123456789'; var otpLength = 6; var otp = ''

    for (let i = 1; i <= otpLength; i++) {
        var index = Math.floor(Math.random() * (digits.length))
        otp = otp + digits[index]
    }

    return otp
}

exports.createUUID = () => {
    var dt = new Date().getTime()
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0
        dt = Math.floor(dt / 16)
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
    return uuid
}


exports.sortingData = (req) => {
    const { sort } = req.query
    const sortKey = sort ? sort.replace('-', '') : 'created_at'
    const sortValue = sort ? sort.includes('-') ? 'DESC' : 'ASC' : 'DESC'

    return { sortKey, sortValue }
}


exports.mediaUpload = async (params) => {
    let data = []
    data.push(params)
    const mediaData = data?.map((item, i) => {
        return {
            name: item.originalname,
            path: 'uploads' + '/' + item.originalname,
            mime_data: item.mimetype,
        }
    })
    const mediaResponse = await Media.bulkCreate(mediaData)

    return mediaResponse
}


exports.getMediaFile = async (params) => {
    const mediaData = await Media.findAll({ where: { food_item_id: params } })
    for (let i = 0; i < mediaData.length; i++) {
        const media = mediaData[i];
        return media
    }
}

















exports.sendEmail = async (email, name, subject, message) => {

    const transporter = nodemailer.createTransport({
        host: `${process.env.EMAIL_HOST}`,
        port: `${process.env.EMAIL_PORT}`,
        auth: {
            user: `${process.env.EMAIL_USER}`,
            pass: `${process.env.EMAIL_PASSWORD}`
        },
        // secure: true
    })

    const data = {
        from: `${process.env.EMAIL_FROM}`,
        to: `${email}`,
        subject: `${subject} - POS-System`,
        html: `${message}`,
    }

    transporter.sendMail(data, (error, info) => {
        if (error) {
            res.status(error.responseCode).send(error)
        }
    })

    return
}

exports.emailEncyption = (params) => {
    let hide = params.split("@")[0].length - 2
    var r = new RegExp(".{" + hide + "}@", "g")
    email = params.replace(r, "***@")

    return email
}

