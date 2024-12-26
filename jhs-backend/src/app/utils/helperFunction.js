
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const { Message } = require('../models/chat/message');
const cheerio = require('cheerio');

var moment = require('moment');
const Cite = require('citation-js');

const generatePassword = exports.generatePassword = (passwordLength) => {
  var numberChars = "0123456789";
  var upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var lowerChars = "abcdefghijklmnopqrstuvwxyz";
  var specialChars = '!@#$%^&*()_+~`|}{[]\:;?><,./-=';
  var allChars = numberChars + upperChars + lowerChars + specialChars;
  var randPasswordArray = Array(passwordLength);
  randPasswordArray[0] = numberChars;
  randPasswordArray[1] = upperChars;
  randPasswordArray[2] = lowerChars;
  randPasswordArray[3] = specialChars;
  randPasswordArray = randPasswordArray.fill(allChars, 3);
  return shuffleArray(randPasswordArray.map(function (x) { return x[Math.floor(Math.random() * x.length)] })).join('');
}

const shuffleArray = exports.shuffleArray = (array) => {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

exports.validateErrorFormatting = (obj) => {
  return {
    errors: (obj.details).map((error) => {
      return {
        'message': error.message,
        'path': error.path[0],
        'field': error.context.key
      }
    })
  };
}

const checkToken = (options) => {

  const { token } = options
  const decode = jwt.verify(token, process.env.SECRET_KEY);
  return decode
}
exports.checkToken;

exports.checkAuthUser = async (token) => {
  try {
    const decoded = checkToken({ token })
    return await User.findById(decoded.userId)
  }
  catch (err) {
    console.log(err)
    return false
  }
}
exports.getUsers = async (id) => {
  try {
    // const users =  await User.find({ _id: { $ne: id } });
    const Users = await User.find({ "_id": { $ne: id } });
    let UserIds = [];
    Users.map(Users => UserIds.push(Users._id));
    const message = await Message.find({
      chatusers: { $in: [id] },
      $or: [
        { "chatusers[0]": { $in: UserIds } },
        { "chatusers[1]": { $in: UserIds } }
      ]
    }).sort({ _id: -1 });

    let userMessage = []
    Users.map((user) => {
      const newUser = { user }
      newUser['message'] = message.find((msg) => msg.chatusers.includes(user._id)),
        userMessage.push(newUser)
    });
    return userMessage

  }
  catch (err) {
    console.log(err)
    return false
  }
}

exports.getExtension = (path) => {
  var basename = path.split(/[\\/]/).pop();  // extract file name from full path ...
  // (supports `\\` and `/` separators)
  pos = basename.lastIndexOf(".");       // get last position of `.`

  if (basename === "" || pos < 1)            // if file name is empty or ...
    return "";                             //  `.` not found (-1) or comes first (0)

  return basename.slice(pos + 1);            // extract extension ignoring `.`
}


exports.parseVancouverReferences = (input) => {
  const references = [];
  const isHTML = input.includes('<p>');
  if (isHTML) {
    const $ = cheerio.load(input);
    const paragraphs = $('p');
    paragraphs.each((index, paragraph) => {
      const referenceText = $(paragraph).text();
      const reference = parseVancouverReferences(referenceText);
      references.push(reference);
    });
  } else {
    const referenceTexts = input.split('\n').filter(line => line.trim() !== '');
    for (const referenceText of referenceTexts) {
      const reference = parseVancouverReferences(referenceText);
      references.push(reference);
    } // end for
  } // end else

  return references;
}

function parseVancouverReferences(text) {
  const references = {
    authors: '',
    title: text,
    type: "journal",
    journal: '',
    year: '',
    volume: '',
    issue: '',
    pages: '',
    original_text: text,
    verified: false,
  };

  const referenceMatches = text.match(/\d+\..+?(\d{4}[a-zA-Z]?[^.]+)/);

  if (referenceMatches) {
    for (const referenceText of referenceMatches) {
      return parseSingleReference(referenceText);
    } // end for
  } // end if
  return references;
}

function parseSingleReference(text) {
  const reference = {
    authors: '',
    title: '',
    type: "journal",
    journal: '',
    year: '',
    volume: '',
    issue: '',
    pages: '',
    original_text: text,
    verified: false,
  };

  text = text.replace(/\d*\.\s/, " ");
  text = text.trim();

  reference.authors = (text.split('.'))[0] + ".";

  // const authorsMatch = authorText.match(/(\w+(?:-\w+)?) (\w+),/g);
  // if (authorsMatch) {
  //   reference.authors = authorsMatch.map(author => {
  //     const [_, lastname, initials] = author.match(/(\w+(?:-\w+)?) (\w+),/);
  //     if (lastname + " " + initials !== "et al") {
  //       return { lastname, initials };
  //     } else {
  //       return false; // skip;
  //     }
  //   }).filter(Boolean);
  // }

  const journalMatch = text.match(/\. ([^.]+)[.?] ([^.]+)\. ([^.]+);/);
  if (journalMatch) {
    reference.title = journalMatch[1];
    reference.journal = journalMatch[2];

    const date3 = journalMatch[3] ? new Date(journalMatch[3]) : new Date();
    reference.year = date3.getFullYear();
  }

  const volumeText = text.split(";").pop();
  const volumePagesMatch = volumeText.match(/^(\d+)\((\d+)\):(\d+)-(\d+)$/);
  if (volumePagesMatch) {
    reference.volume = volumePagesMatch[1] ?? "";
    reference.issue = volumePagesMatch[2] ?? "";
    reference.pages = calculatePages(volumePagesMatch[3] ?? 0, volumePagesMatch[4] ?? 0);
  }

  return reference;
}

exports.checkCitationSequence = (input) => {
  const citationData = [];
  const citationRegex = /\([0-9-0-9, ]*\)/g;
  while (citationMatch = citationRegex.exec(input)) {
    const arrayValue = ((citationMatch[0]).slice(1, -1)).split(",");
    for (citation in arrayValue) {
      if (arrayValue[citation].includes("-")) {
        const arraySequence = ((arrayValue[citation].trim())).split("-");
        if (parseInt(arraySequence[0]) < parseInt(arraySequence[1])) {
          startingValue = parseInt(arraySequence[0]);
          endingValue = parseInt(arraySequence[1]);
          while (startingValue <= endingValue) {
            citationData.push(parseInt(startingValue++));
          } // end while
        } // end if
      } else {
        citationData.push(parseInt(arrayValue[citation].trim()));
      } // end else
    }
    // Avoid infinite loop
    if (!citationRegex.global) break;
  } // end while

  const citationInfo = citationData.filter((item, index) => citationData.indexOf(item) === index).sort(function (a, b) { return a - b; })
  for (index in citationInfo) {
    if (citationInfo[index] != (parseInt(index) + 1)) {
      // incorrect sequence
      return {
        'validation': true,
        'citation': citationInfo,
      };
    } // end if
  } // end if
  // correct sequence
  return {
    'validation': false,
    'citation': citationInfo,
  };
}

exports.checkTableSequence = (input) => {
  const tableCitationData = [];
  const tableCitationRegex = /\((T|t)able [0-9-0-9]*\)/g;
  while (tableCitationMatch = tableCitationRegex.exec(input)) {
    const arrayValue = ((tableCitationMatch[0]).slice(1, -1)).split(",");
    for (tableCitation in arrayValue) {
      tableCitationData.push(parseInt(arrayValue[tableCitation].trim().split(" ")[1]));
    }
    // Avoid infinite loop
    if (!tableCitationRegex.global) break;
  } // end while

  const tableCitationInfo = tableCitationData.filter((item, index) => tableCitationData.indexOf(item) === index).sort(function (a, b) { return a - b; })
  if (tableCitationInfo.length != 0) {
    for (index in tableCitationInfo) {
      if (tableCitationInfo[index] != (parseInt(index) + 1)) {
        // incorrect sequence
        return {
          'validation': true,
          'tableCitation': tableCitationInfo,
        };
      } // end if
    } // end if
  } // end if

  // correct sequence
  return {
    'validation': false,
    'tableCitation': tableCitationInfo,
  };
}

exports.checkFigureSequence = (input) => {
  const figureCitationData = [];
  const figureCitationRegex = /\((F|f)igure [0-9-0-9]*\)/g;
  while (figureCitationMatch = figureCitationRegex.exec(input)) {
    const arrayValue = ((figureCitationMatch[0]).slice(1, -1)).split(",");
    for (figureCitation in arrayValue) {
      figureCitationData.push(parseInt(arrayValue[figureCitation].trim().split(" ")[1]));
    }
    // Avoid infinite loop
    if (!figureCitationRegex.global) break;
  } // end while

  const figureCitationInfo = figureCitationData.filter((item, index) => figureCitationData.indexOf(item) === index).sort(function (a, b) { return a - b; });
  if (figureCitationInfo.length != 0) {
    for (index in figureCitationInfo) {
      if (figureCitationInfo[index] != (parseInt(index) + 1)) {
        // incorrect sequence
        return {
          'validation': true,
          'figureCitation': figureCitationInfo,
        };
      } // end if
    } // end if
  } // end if

  // correct sequence
  return {
    'validation': false,
    'figureCitation': figureCitationInfo,
  };
}

function calculatePages(startingPage, noOfPages) {
  const firstPage = parseInt(startingPage);
  const numPages = parseInt(noOfPages);

  if (isNaN(firstPage)) {
    return `${startingPage}`;
  }

  const lastPage = (firstPage + numPages) - 1;

  return `${firstPage}-${lastPage}`;
}

exports.makeReferenceTextFromList = async (referenceList) => {
  var text = referenceList.map((reference, index) => {
    var authors = reference.authors.split(',').map((item, index) => {
      return {
        family: item,
      }
    });

    return {
      id: `${index}`,
      "citation-key": `${index}`,
      author: [
        ...authors
      ],
      page: `${reference?.pages ?? "-"}`,
      volume: `${reference?.volume ?? 0}`,
      issue: `${reference?.issue ?? 0}`,
      year: `${reference?.year ?? 0}`,
      'container-title': `${reference?.journal}`,
      title: `${reference?.title}`,
      issued: {
        'date-parts': [[
          moment(reference?.year).format('YYYY'),
        ]]
      },
      type: `article-${reference?.type}`,
      DOI: `${reference?.doi}`,
    };
  });

  const data = await Cite.async(text);

  return data.format('bibliography', { template: "vancouver", format: 'html' });
}

exports.getLocationFromCoordinates = async (lat, lon) => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`;
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return "Error fetching city name";
  }
}

exports.groupByCountryViewsAndDownloads = (views, downloads) => {
  const combined = [];

  const map = new Map();

  // Process views array
  views.forEach(({ code, country }) => {
    const key = `${country}`;
    if (!map.has(key)) {
      map.set(key, { id: code.split('-')[0], country, views: 0, downloads: 0 });
    }
    map.get(key).views += 1;
  });

  // Process downloads array
  downloads.forEach(({ code, country }) => {
    const key = `${country}`;
    if (!map.has(key)) {
      map.set(key, { id: code.split('-')[0], country, views: 0, downloads: 0 });
    }
    map.get(key).downloads += 1;
  });

  // Convert map to an array
  map?.forEach((value) => combined.push(value));

  return combined;
}

exports.groupBySaudiRegionViewsAndDownloads = (views, downloads) => {
  const combined = [];

  const map = new Map();

  // Process views array
  views.forEach(({ code, region, country }) => {
    const key = `${region}`;
    if (['SA'].includes(code.split('-')[0])) {
      if (!map.has(key)) {
        map.set(key, { id: code, countryId: code.split('-')[0], name: region, country, views: 0, downloads: 0 });
      }
      map.get(key).views += 1;
    }
  });

  // Process downloads array
  downloads.forEach(({ code, region, country}) => {
    const key = `${region}`;
    if (['SA'].includes(code.split('-')[0])) {
      if (!map.has(key)) {
        map.set(key, { id: code, countryId: code.split('-')[0], name: region, country, views: 0, downloads: 0 });
      }
      map.get(key).downloads += 1;
    }
  });

  // Convert map to an array
  map?.forEach((value) => combined.push(value));

  return combined;
}
exports.groupByUAERegionViewsAndDownloads = (views, downloads) => {
  const combined = [];

  const map = new Map();

  // Process views array
  views.forEach(({ code, region, country }) => {
    const key = `${region}`;
    if (['AE'].includes(code.split('-')[0])) {
      if (!map.has(key)) {
        map.set(key, { id: code, countryId: code.split('-')[0], name: region, country, views: 0, downloads: 0 });
      }
      map.get(key).views += 1;
    }
  });

  // Process downloads array
  downloads.forEach(({ code, region, country}) => {
    const key = `${region}`;
    if (['AE'].includes(code.split('-')[0])) {
      if (!map.has(key)) {
        map.set(key, { id: code, countryId: code.split('-')[0], name: region, country, views: 0, downloads: 0 });
      }
      map.get(key).downloads += 1;
    }
  });

  // Convert map to an array
  map?.forEach((value) => combined.push(value));

  return combined;
}
exports.groupByQatarRegionViewsAndDownloads = (views, downloads) => {
  const combined = [];

  const map = new Map();

  // Process views array
  views.forEach(({ code, region, country }) => {
    const key = `${region}`;
    if (['QA'].includes(code.split('-')[0])) {
      if (!map.has(key)) {
        map.set(key, { id: code, countryId: code.split('-')[0], name: region, country, views: 0, downloads: 0 });
      }
      map.get(key).views += 1;
    }
  });

  // Process downloads array
  downloads.forEach(({ code, region, country}) => {
    const key = `${region}`;
    if (['QA'].includes(code.split('-')[0])) {
      if (!map.has(key)) {
        map.set(key, { id: code, countryId: code.split('-')[0], name: region, country, views: 0, downloads: 0 });
      }
      map.get(key).downloads += 1;
    }
  });

  // Convert map to an array
  map?.forEach((value) => combined.push(value));

  return combined;
}
exports.groupByOmanRegionViewsAndDownloads = (views, downloads) => {
  const combined = [];

  const map = new Map();

  // Process views array
  views.forEach(({ code, region, country }) => {
    const key = `${region}`;
    if (['OM'].includes(code.split('-')[0])) {
      if (!map.has(key)) {
        map.set(key, { id: code, countryId: code.split('-')[0], name: region, country, views: 0, downloads: 0 });
      }
      map.get(key).views += 1;
    }
  });

  // Process downloads array
  downloads.forEach(({ code, region, country}) => {
    const key = `${region}`;
    if (['OM'].includes(code.split('-')[0])) {
      if (!map.has(key)) {
        map.set(key, { id: code, countryId: code.split('-')[0], name: region, country, views: 0, downloads: 0 });
      }
      map.get(key).downloads += 1;
    }
  });

  // Convert map to an array
  map?.forEach((value) => combined.push(value));

  return combined;
}
exports.groupByKuwaitRegionViewsAndDownloads = (views, downloads) => {
  const combined = [];

  const map = new Map();

  // Process views array
  views.forEach(({ code, region, country }) => {
    const key = `${region}`;
    if (['KW'].includes(code.split('-')[0])) {
      if (!map.has(key)) {
        map.set(key, { id: code, countryId: code.split('-')[0], name: region, country, views: 0, downloads: 0 });
      }
      map.get(key).views += 1;
    }
  });

  // Process downloads array
  downloads.forEach(({ code, region, country}) => {
    const key = `${region}`;
    if (['KW'].includes(code.split('-')[0])) {
      if (!map.has(key)) {
        map.set(key, { id: code, countryId: code.split('-')[0], name: region, country, views: 0, downloads: 0 });
      }
      map.get(key).downloads += 1;
    }
  });

  // Convert map to an array
  map?.forEach((value) => combined.push(value));

  return combined;
}
exports.groupByBahrainRegionViewsAndDownloads = (views, downloads) => {
  const combined = [];

  const map = new Map();

  // Process views array
  views.forEach(({ code, region, country }) => {
    const key = `${region}`;
    if (['BH'].includes(code.split('-')[0])) {
      if (!map.has(key)) {
        map.set(key, { id: code, countryId: code.split('-')[0], name: region, country, views: 0, downloads: 0 });
      }
      map.get(key).views += 1;
    }
  });

  // Process downloads array
  downloads.forEach(({ code, region, country}) => {
    const key = `${region}`;
    if (['BH'].includes(code.split('-')[0])) {
      if (!map.has(key)) {
        map.set(key, { id: code, countryId: code.split('-')[0], name: region, country, views: 0, downloads: 0 });
      }
      map.get(key).downloads += 1;
    }
  });

  // Convert map to an array
  map?.forEach((value) => combined.push(value));

  return combined;
}

exports.groupByDateViewsAndDownloads = (viewList, downloadList) => {
  // Helper function to normalize date to just the YYYY-MM-DD format
  function normalizeDate(dateString) {
    return new Date(dateString).toISOString().split('T')[0];
  }

  // Combine both arrays into a single one with a type indicator (views/downloads)
  const combinedList = [
    ...viewList.map(item => ({ date: item.date, type: 'view' })),
    ...downloadList.map(item => ({ date: item.date, type: 'download' }))
  ];

  // Reduce to count occurrences by date for views and downloads
  return combinedList.reduce((acc, item) => {
    const date = normalizeDate(item.date);
    
    if (!acc[date]) {
      acc[date] = { views: 0, downloads: 0 };
    }

    if (item.type === 'view') {
      acc[date].views++;
    } else if (item.type === 'download') {
      acc[date].downloads++;
    }

    return acc;
  }, {});
}

exports.groupByDate = (viewList, downloadList) => {
  const combinedData = {};

  // Process viewList
  viewList.forEach(({ date }) => {
    const dateKey = new Date(date).toISOString().split('T')[0]; // Group by date only (ignoring time)
    if (!combinedData[dateKey]) {
      combinedData[dateKey] = { views: 0, downloads: 0 };
    }
    combinedData[dateKey].views += 1;
  });

  // Process downloadList
  downloadList.forEach(({ date }) => {
    const dateKey = new Date(date).toISOString().split('T')[0]; // Group by date only (ignoring time)
    if (!combinedData[dateKey]) {
      combinedData[dateKey] = { views: 0, downloads: 0 };
    }
    combinedData[dateKey].downloads += 1;
  });

  // Convert the combined data into an array of objects with timestamp
  const result = Object.keys(combinedData).map(date => ({
    date: date,
    views: combinedData[date].views,
    downloads: combinedData[date].downloads,
  }));

  return result.sort((a, b) => b.date - a.date); // Sort by date in descending order
}

exports.convertRegionValue = (region) => {
  const idMapping = {
    "SA-01": "SA-RA",
    "SA-02": "SA-MK",
    "SA-03": "SA-MD",
    "SA-04": "SA-EP",
    "SA-05": "SA-AS",
    "SA-06": "SA-QA",
    "SA-07": "SA-HA",
    "SA-08": "SA-TB",
    "SA-09": "SA-JO",
    "SA-10": "SA-NA",
    "SA-11": "SA-BH",
    "SA-12": "SA-JZ",
    "SA-13": "SA-NB",
  };

  // Find the key corresponding to the value
  return Object.keys(idMapping).find(key => idMapping[key] === region) ?? region;
}