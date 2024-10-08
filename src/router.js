import { Router } from 'express';
import * as Owners from './controllers/owner_controller';
import * as Land from './controllers/land_controller';
import * as User from './controllers/user_controller';
// import signS3 from './services/s3';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to our owners and land holding API!' });
});

// router.get('/:userId/owners', (req, res) => {
//   const { userId } = req.params;
//   res.json({ message: userId });
// });

router.route('/:userId/owners')
// fetching owners
  .get(async (req, res) => {
    // use req.body etc to await some contoller function
    // send back the result
    // or catch the error and send back an error
    const { userId } = req.params;

    try {
      const response = await User.getOwners(userId);
      return res.json(response);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  })
  .post(async (req, res) => {
    // Store owner data
    const { userId } = req.params;
    const { ownerData } = req.body;

    try {
      const response = await User.saveOwner(userId, ownerData);
      return res.json(response);
    } catch (error) {
      return res.status(422).json({ error: error.message });
    }
  });

router.route('/:userId/owners/:ownerName')
  .get(async (req, res) => {
    const { ownerName, userId } = req.params;
    try {
      const result = await Owners.getOwner(ownerName, userId);
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
    const ownerData = req.body;
    try {
      const result = await Owners.updateOwner(ownerName, ownerData);
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

router.route('/:userId/owners/:ownerName/land')
// fetching land holdings
  .get(async (req, res) => {
    const { userId, ownerName } = req.params;
    try {
      const result = await Land.getOwnersLandHoldings(userId, ownerName);
      const data = res.json(result);
      return data;
    } catch (error) {
      return res.status(422).json({ error: error.message });
    }
  })
  .post(async (req, res) => {
    const { userId, ownerName } = req.params;
    const landData = req.body;
    try {
      const result = await Land.saveLandHolding(userId, ownerName, landData);
      const data = res.json(result);
      return data;
    } catch (error) {
      return res.status(422).json({ error: error.message });
    }
  });

router.route('/:userId/owners/:ownerName/land/:landName')
  .get(async (req, res) => {
    const { userId, ownerName, landName } = req.params;
    try {
      const result = await Land.getLandHolding(userId, ownerName, landName);
      if (!result) {
        return res.status(404).json({ error: 'Land holding not found' });
      }
      return res.json(result);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  })
  .put(async (req, res) => {
    const { userId, ownerName, landName } = req.params;
    const landData = req.body;
    try {
      const result = await Land.updateLandHolding(userId, ownerName, landName, landData);
      return res.json(result);
    } catch (error) {
      return res.status(422).json({ error: error.message });
    }
  })
  .delete(async (req, res) => {
    const { userId, ownerName, landName } = req.params;
    try {
      const result = await Land.deleteLandHolding(userId, ownerName, landName);
      return res.json(result);
    } catch (error) {
      return res.status(422).json({ error: error.message });
    }
  });

// router.get('/sign-s3', signS3);

export default router;
