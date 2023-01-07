import dbConnect from "../../../lib/database/dbConnect.js";
import Project from '../../../models/Project.js';
import initApiRoute from "../../../lib/utils/restApiHelper.js";

// Keep the import -> need to initialize the schema
import User from '../../../models/User.js';

async function handlePost(req) {
  let {pageIndex, keyword} = req.body;
  return search(pageIndex, keyword);
}

export async function search(pageIndex, keyword) {
  //First index starts at 1
  const page = pageIndex + 1;
  await dbConnect();
  const query = {};
  if (keyword) {
    const regex = {$regex: keyword, $options: 'i'};
    query.name = regex;
  }
  const aggregate = Project.aggregate([
    {
      $match: query
    },
    {
      $project: {
        "createdAt": 0,
        "createdBy": 0,
      }
    }
  ])
  const options = {
    sort: {'name': 1},
    page,
    limit: 10,
  };
  const result = await Project.aggregatePaginate(aggregate, options);
  result.page--;
  return result;
}

export default initApiRoute(null, {handle: handlePost}, null, null);
