import express from 'express';
import Event from '../model/events';

const router = express.Router();


/*GET Events Page*/

router.get('/', (req,res,next) =>{
  console.log("Request for Events page");

  Event.find({}, (err, event) =>{
    if (err) return res.status(404).send('Not found');
    res.json(event);
  });

});

/*Create Event*/

router.post('/', (req,res,next) => {

  const event = new Event();
  event.eventPostId = req.body.eventPostId || "Unknown";
  event.referenceUserId = req.body.referenceUserId || "Unknown";
  event.DateTime = req.body.DateTime || "unknown";
  event.eventText = req.body.eventText || "Unknown";
  //add multer here//
  event.save((err, event) => {
       res.json(event);
   });
});

/*Read event*/

router.get('/:id', (req,res,next) =>{
  const id = req.param.id;
  Event.findById(id, (err,event)) =>{
    if (err) return res.status(404).send('Not found');
    res.json(event);
  });
});

Export default router;
