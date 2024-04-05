const nodemailer = require('nodemailer')
const { Media, OrderItem } = require('../models')

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



exports.getOrdes = async (orders) => {
    const ids = []
    orders.rows.map((item) => {
      ids.push(item.id)
    })
  
    const orderItems = await OrderItem.findAll({ where: { order_id: ids } })
  
    const attributeId = []
    const attributeValueId = []
    
    orderItems.map((item) => {
      attributeId.push(item.attribute_id)
      attributeValueId.push(item.attribute_value_id)
    })
  
    const attribute = await Attribute.findAll({ where: { id: attributeId } })
  
    const attributes = attribute.map((item, i) => {
      return ({
        id: item.id,
        name: item.name,
        slug: item.slug
      })
    })
  
    const attributeValue = await AttributesValue.findAll({ where: { id: attributeValueId } })
  
    const attributeValues = attributeValue.map((item, i) => {
      return ({
        id: item.id,
        name: item.name,
        slug: item.slug
      })
    })
    const result = products.rows.map((item, i) => {
  
      const totalClickedEmail = productAttributesRelationship.filter((id) => { return (id.product_id == item.id) })
      const attributeData = attribute.filter((id)=> { return (id.id == totalClickedEmail[i].attribute_id) })
      console.log("attributeData", attributeData);
  
      return ({
          id: item.id,
          name: item.name,
          barcode: item.barcode,
          description: item.description,
          short_description: item.short_description,
          sku: item.sku,
          stock: item.stock,
          regular_price: item.regular_price,
          discounted_price: item.discounted_price,
          cost_per_item: item.cost_per_item,
          low_stock_threshold: item.low_stock_threshold,
          product_type: item.product_type,
          backorders: item.backorders,
          stock_status: item.stock_status,
          manage_stock: item.manage_stock,
          dimensions: item.dimensions,
          created_at: item.created_at,
          updated_at: item.updated_at,
          attributes: attributeData,
          // attributeValues: attributeValues[i]
      })
    })
  
    const data = {count: products.count, rows: result}
  
    return data
  }



const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path'); // Import the path module



exports.generateInvoice = () => {
    // Create a new PDF document
    const doc = new PDFDocument();

    // File path to save the generated PDF
    const filePath = path.join(__dirname, "../invoices", 'example.pdf');

    // Pipe the PDF document to a write stream
    doc.pipe(fs.createWriteStream(filePath));

    // Add content to the PDF
    doc
        .fontSize(27)
        .text('Invoice', { align: 'center' })
        .moveDown(); // Move down one line

    // Add invoice details
    doc
        .fontSize(12)
        .text('Invoice Date: January 1, 2024', 50, 120)
        .text('Invoice Number: #123456789', 50, 140)
        .moveDown(); // Move down one line

    // Add customer information
    doc
        .fontSize(14)
        .text('Customer Information:', 50, 180)
        .fontSize(12)
        .text('Name: John Doe', 50, 200)
        .text('Email: john@example.com', 50, 220)
        .moveDown(); // Move down one line

    // Add order details
    doc
        .fontSize(14)
        .text('Order Details:', 50, 260)
        .fontSize(12)
        .text('Product 1: $50', 50, 280)
        .text('Product 2: $30', 50, 300)
        .moveDown(); // Move down one line

    // Add total amount
    doc
        .fontSize(16)
        .text('Total Amount: $80', 50, 340);

    // Finalize PDF file
    doc.end();
}


exports.downloadInvoice = (orders) => {
    // Create a new PDF document
    const doc = new PDFDocument();

    // File path to save the generated PDF
    const filePath = path.join(__dirname, "../invoices", 'example.pdf');

    // Pipe the PDF document to a write stream
    doc.pipe(fs.createWriteStream(filePath));

    // Add content to the PDF
    doc
        .fontSize(27)
        .text('Invoice', { align: 'center' })
        .moveDown(); // Move down one line

    // Add invoice details
    doc
        .fontSize(12)
        .text(`Invoice Date: ${orders.createdAt}`, 50, 120)
        .text('Invoice Number: #123456789', 50, 140)
        .moveDown(); // Move down one line

    // Add customer information
    doc
        .fontSize(14)
        .text('Customer Information:', 50, 180)
        .fontSize(12)
        .text('Name: John Doe', 50, 200)
        .text('Email: john@example.com', 50, 220)
        .moveDown(); // Move down one line

    // Add order details

    orders?.products?.map((item) => {
        doc
            .fontSize(14)
            .text('Order Details:', 50, 260)
            .fontSize(12)
            .text(`Product 1: ${item.price}`, 50, 280)
            .moveDown(); // Move down one line
    })



    // Add total amount
    doc
        .fontSize(16)
        .text('Total Amount: $80', 50, 340);

    // Finalize PDF file
    doc.end();
}