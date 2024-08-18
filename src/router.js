import { Router } from 'express';
import * as Owners from './controllers/owner_controller';
import * as Land from './controllers/land_controller';
import * as User from './controllers/user_controller';
// import signS3 from './services/s3';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to our owners and land holding API!' });
});

router.route('/:userId/owners')
// fetching owners
  .get(async (req, res) => {
    // use req.body etc to await some contoller function
    // send back the result
    // or catch the error and send back an error
    const { userId } = req.params;

    try {
      const result = await User.getOwners(userId);
      return res.json(result);
    } catch (error) {
      return res.status(422).json({ error: error.message });
    }
  })
  .post(async (req, res) => {
    // Store owner data
    const { userId, ownerData } = req.body;

    // fields = userId, ownerData

    try {
      const result = await User.saveOwner(userId, ownerData);
      return res.json(result);
    } catch (error) {
      return res.status(422).json({ error: error.message });
    }
  });

router.route('/:userId/owners/:ownerName')
  .get(async (req, res) => {
    const { ownerName } = req.params;
    try {
      const result = await Owners.getOwner(ownerName);
      if (!result) {
        return res.status(404).json({ error: 'Owner not found' });
      }
      return res.json(result);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  })
  .put(async (req, res) => {
    const { ownerName } = req.params;
    const fields = req.body;
    try {
      const result = await Owners.updateOwner(ownerName, fields);
      return res.json(result);
    } catch (error) {
      return res.status(422).json({ error: error.message });
    }
  })
  .delete(async (req, res) => {
    const { ownerName } = req.params;
    try {
      const result = await Owners.deleteOwner(ownerName);
      return res.json(result);
    } catch (error) {
      return res.status(422).json({ error: error.message });
    }
  });

router.route('/:userId/landHoldings')
// fetching land holdings
  .get(async (req, res) => {
    // use req.body etc to await some contoller function
    // send back the result
    // or catch the error and send back an error
    try {
      const result = await Land.getLandHoldings();
      return res.json(result);
    } catch (error) {
      return res.status(422).json({ error: error.message });
    }
  })
  .post(async (req, res) => {
    const fields = req.body;
    try {
      const result = await Land.createLandHolding(fields);
      return res.json(result);
    } catch (error) {
      return res.status(422).json({ error: error.message });
    }
  });

router.route('/:userId/landHoldings/:name')
  .get(async (req, res) => {
    const { name } = req.params;
    try {
      const result = await Land.getLandHolding(name);
      if (!result) {
        return res.status(404).json({ error: 'Land holding not found' });
      }
      return res.json(result);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  })
  .put(async (req, res) => {
    const { name } = req.params;
    const fields = req.body;
    try {
      const result = await Land.updateLandHolding(name, fields);
      return res.json(result);
    } catch (error) {
      return res.status(422).json({ error: error.message });
    }
  })
  .delete(async (req, res) => {
    const { name } = req.params;
    try {
      const result = await Land.deleteLandHolding(name);
      return res.json(result);
    } catch (error) {
      return res.status(422).json({ error: error.message });
    }
  });

// router.get('/sign-s3', signS3);

export default router;
