import dbConnect from "../../../lib/database/dbConnect.js";
import Operation from "../../../models/Operation.js";
import initApiRoute from "../../../lib/utils/restApiHelper.js";

// Keep the import -> need to initialize the schema
import User from '../../../models/User.js';
import Project from '../../../models/Project.js';

async function handlePost(req) {
  let {pageIndex, keyword, havingLastGasUsage} = req.body;
  return search(pageIndex, keyword, havingLastGasUsage);
}

export async function search(pageIndex, keyword, havingLastGasUsage) {
  //First index starts at 1
  const page = pageIndex + 1;
  await dbConnect();
  const query = havingLastGasUsage ? {
    lastGasUsages: {$exists: true, $ne: []}
  } : {};
  if (keyword) {
    const regex = {$regex: keyword, $options: 'i'};
    query['$or'] = [
      {
        'project.name': regex
      },
      {
        functionName: regex
      },
      {
        contractAddress: regex
      },
    ];
  }
  const aggregate = Operation.aggregate([
    {
      $lookup: {
        from: 'projects',
        localField: 'project',
        foreignField: '_id',
        as: 'project'
      },
    },
    {
      $match: query
    },
    {
      $unwind: "$project"
    },
    {
      $project: {
        "lastGasUsages": 0,
        "minGasUsage": 0,
        "createdAt": 0,
        "createdBy": 0,
        "methodId": 0,
        "implementationAddress": 0
      }
    }
  ])
  const options = {
    sort: {'project.name': 1},
    page,
    limit: 10,
  };
  const result = await Operation.aggregatePaginate(aggregate, options);
  result.page--;
  return result;
}

export default initApiRoute(null, {handle: handlePost}, null, null);