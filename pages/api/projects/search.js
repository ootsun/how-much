import dbConnect from "../../../lib/database/dbConnect.js";
import Project from '../../../models/Project.js';
import initApiRoute from "../../../lib/utils/restApiHelper.js";

// Keep the import -> need to initialize the schema
import User from '../../../models/User.js';

async function handlePost(req) {
  let {pageIndex, keyword, fullMatch} = req.body;
  return search(pageIndex, keyword, fullMatch);
}

export async function search(pageIndex, keyword, fullMatch) {
  //First index starts at 1
  const page = pageIndex + 1;
  await dbConnect();
  const query = {};
  if (keyword && !fullMatch) {
    query.name = {$regex: keyword.trim(), $options: 'i'};
  } else if(keyword && fullMatch) {
    query.name = {$regex: `^${keyword.trim()}$`, $options: 'i'};
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
