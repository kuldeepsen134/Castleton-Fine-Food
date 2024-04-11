const { Subscriber } = require("../models");
const { handleResponse, handleError, getPagingResults, handleSearchQuery, sortingData, getPagination, sendEmail } = require("../utils/helpers");
const { strings } = require("../utils/string");

exports.create = async (req, res) => {
    try {
        const data = { email: req.body.email };

        const subscribe = await Subscriber.create(data);
        
        const subject = 'Thank You for Subscribing to Our Newsletter!'

        const message = `<div style="margin:auto width:70%">
                            <div style="font-family: Helvetica,Arial,sans-serifmin-width:1000pxoverflow:autoline-height:2">
                            <div style="margin:50px autowidth:60%padding:20px 0">
                            
                            <p>You have successfully subscribed to our promotions, new products and sales. Directly to your inbox.</p>
                        
                            <p style="font-size:0.9em">Castletone-Fine-Food</p>
                            </div>
                        </div>
                        </div>`

        sendEmail(req.body.email, req.body.email, subject, message);

        handleResponse(res, subscribe, strings.ThankYourforSubscribe, 1)

    } catch (err) {
        handleError(err, req, res, 0)
    }
};



exports.findAll = async (req, res) => {
    try {
        const { page, size, sort } = req.query;
        const { limit, offset } = getPagination(page, size);
        const sortResponse = sortingData(req);

        const subscribe = await Subscriber.findAndCountAll({
            where: handleSearchQuery(req, ['id', 'email',]),
            order: [[sortResponse.sortKey, sortResponse.sortValue]],
            limit, offset,
        });

        handleResponse(res, getPagingResults(subscribe, page, limit), strings.ThankYourforSubscribe, 1)

    } catch (err) {
        handleError(err, req, res, 0)
    }
};