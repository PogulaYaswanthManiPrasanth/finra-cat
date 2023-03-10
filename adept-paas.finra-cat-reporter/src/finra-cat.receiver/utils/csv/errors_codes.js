module.exports = [
  {
    "code": "1101",
    "description": "Missing Metadata File",
    "explaination": "Timeout waiting for associated metadata file. Data files for which an associated Metadata file is not received within 30 minutes of the receipt of the data file.",
    "type": "Warning"
  },
  {
    "code": "1103",
    "description": "Duplicate File",
    "explaination": "A file with the same base name was previously accepted by CAT.",
    "type": "Error"
  },
  {
    "code": "1104",
    "description": "Missing or Invalid CAT Submitter ID",
    "explaination": "CAT Submitter ID is missing or invalid.",
    "type": "Error"
  },
  {
    "code": "1105",
    "description": "Missing or Invalid CAT Reporter IMID",
    "explaination": "CAT Reporter IMID is missing or is not a valid Market Participant for the Generation Date.",
    "type": "Error"
  },
  {
    "code": "1106",
    "description": "Missing or Invalid File Generation Date",
    "explaination": "File Generation Date is missing or is not a valid date.",
    "type": "Error"
  },
  {
    "code": "1107",
    "description": "Metadata File Not Readable",
    "explaination": "Metadata file format is not readable as it is not in a valid JSON format or contains an incorrect delimiter.",
    "type": "Error"
  },
  {
    "code": "1108",
    "description": "File exceeds the supported size limit",
    "explaination": "File size exceeds the maximum uncompressed size of 100 GB via SFTP and 1GB via the CAT Reporter Portal.",
    "type": "Error"
  },
  {
    "code": "1109",
    "description": "Unauthorized CAT Submitter ID",
    "explaination": "CAT Submitter ID has not been authorized to submit for the CAT Reporter IMID. Verify that the CAT Submitter ID and CAT Reporter IMID in the file name have a transmitting relationship.",
    "type": "Error"
  },
  {
    "code": "1110",
    "description": "Missing File Information",
    "explaination": "File information is not found in the Metadata File submission.",
    "type": "Error"
  },
  {
    "code": "1111",
    "description": "Missing or Invalid record count",
    "explaination": "The record count in the metadata file is missing or is a negative number, or a non-zero number for DEL file.",
    "type": "Error"
  },
  {
    "code": "1112",
    "description": "Mismatched Metadata File Format",
    "explaination": "The associated Metadata file is not in the same format as the data file submitted to CAT.",
    "type": "Error"
  },
  {
    "code": "1115",
    "description": "Missing or Invalid Compressed Hash",
    "explaination": "Compressed Hash in meta file is missing or invalid (e.g., doesn't match the data file).",
    "type": "Error"
  },
  {
    "code": "1116",
    "description": "Missing or Invalid File Version",
    "explaination": "File Version in Metadata file is missing or invalid.",
    "type": "Error"
  },
  {
    "code": "1120",
    "description": "Invalid File in Delete Instruction",
    "explaination": "The delete instruction is on a file that does not exist in CAT, contains event dates more than four days prior to the current processing date, or contains actionType other than ???NEW???.",
    "type": "Error"
  },
  {
    "code": "1121",
    "description": "Missing Metadata File",
    "explaination": "Timeout waiting for associated metadata file. Data files for which an associated Metadata file is not received within 2 hours of the receipt of the data file.",
    "type": "Error"
  },
  {
    "code": "1122",
    "description": "Missing Data File",
    "explaination": "Metadata file includes one or more data files that were not received prior to the receipt of the metadata file.",
    "type": "Error"
  },
  {
    "code": "1123",
    "description": "Invalid thirdParty",
    "explaination": "Third Party is invalid.",
    "type": "Error"
  },
  {
    "code": "1124",
    "description": "Unauthorized thirdParty",
    "explaination": "Third Party Reporting Agent has not been authorized to view feedback and error data for data submitted on behalf of the CAT Reporter. Verify that the CAT Reporter IMID and the thirdParty provided in the meta data file have an active reporting relationship.",
    "type": "Error"
  },
  {
    "code": "1126",
    "description": "Missing or Invalid doneForDay",
    "explaination": "doneForDay is missing or with invalid value.",
    "type": "Error"
  },
  {
    "code": "1127",
    "description": "Missing or Invalid Type",
    "explaination": "Type in the Metadata file is missing or invalid.",
    "type": "Error"
  },
  {
    "code": "1128",
    "description": "File exceeds maximum records allowed for Web upload",
    "explaination": "A single data file uploaded via the Reporter Portal must not contain greater than 100,000 records.",
    "type": "Error"
  },
  {
    "code": "2001",
    "attributes": ["accountHolderType"],
    "description": "Missing or Invalid accountHolderType",
    "explaination": "accountHolderType must be populated with one of the allowable values.",
    "type": "Error"
  },
  {
    "code": "2002",
    "attributes": ["actionType"],
    "description": "Missing or Invalid actionType",
    "explaination": "actionType must be populated with one of the allowable values.",
    "type": "Error"
  },
  {
    "code": "2003",
    "attributes": [""],
    "description": "Missing or Invalid affiliateFlag",
    "explaination": "affiliateFlag must be populated with one of the allowable values.",
    "type": "Error"
  },
  {
    "code": "2004",
    "attributes": [""],
    "description": "Missing or Invalid aggregatedOrders",
    "explaination": "If populated, aggregatedOrders must be in the correct format.",
    "type": "Error"
  },
  {
    "code": "2005",
    "attributes": [""],
    "description": "Missing or Invalid askPrice",
    "explaination": "When required, askPrice must be in the correct format. Required when askQty is populated.",
    "type": "Error"
  },
  {
    "code": "2006",
    "attributes": [""],
    "description": "Missing or Invalid askQty",
    "explaination": "When required, askQty must be in the correct format. Required askPrice is populated.",
    "type": "Error"
  },
  {
    "code": "2007",
    "attributes": [""],
    "description": "Missing or Invalid atsDisplayInd",
    "explaination": "When required, atsDisplayInd must be one of the allowable values.",
    "type": "Error"
  },
  {
    "code": "2008",
    "attributes": [""],
    "description": "Missing or Invalid atsOrderType",
    "explaination": "When required, atsOrderType must be equal to a unique identifier representing the specific order type provided to CAT by the ATS.",
    "type": "Error"
  },
  {
    "code": "2009",
    "attributes": [""],
    "description": "Missing or Invalid bidPrice",
    "explaination": "When required, bidPrice must be in the correct format; must be populated if bidQty is populated.",
    "type": "Error"
  },
  {
    "code": "2010",
    "attributes": [""],
    "description": "Missing or Invalid bidQty",
    "explaination": "When required, bidQty must be in the correct format; must be populated if bidPrice is populated.",
    "type": "Error"
  },
  {
    "code": "2011",
    "attributes": [""],
    "description": "Invalid CATReporterIMID",
    "explaination": "If populated, CATReporterIMID must be valid for the Event Date and must equal the CATReporterIMID in the filename.",
    "type": "Error"
  },
  {
    "code": "2012",
    "attributes": [""],
    "description": "Missing or Invalid cancelQty",
    "explaination": "cancelQty must be populated in the correct format.",
    "type": "Error"
  },
  {
    "code": "2013",
    "attributes": [""],
    "description": "Missing or Invalid cancelFlag",
    "explaination": "cancelFlag must be populated in the correct format.",
    "type": "Error"
  },
  {
    "code": "2014",
    "attributes": [""],
    "description": "Missing or Invalid cancelTimestamp",
    "explaination": "When required, cancelTimestamp must be in the correct format; must be populated if cancelFlag is True.",
    "type": "Error"
  },
  {
    "code": "2015",
    "attributes": [""],
    "description": "Missing or Invalid capacity",
    "explaination": "capacity must be populated with one of the allowable values.",
    "type": "Error"
  },
  {
    "code": "2017",
    "attributes": [""],
    "description": "Missing or Invalid custDspIntrFlag",
    "explaination": "custDspIntrFlag must be populated with one of the allowable values.",
    "type": "Error"
  },
  {
    "code": "2018",
    "attributes": [""],
    "description": "Missing or Invalid deptType",
    "explaination": "deptType must be populated with one of the allowable values.",
    "type": "Error"
  },
  {
    "code": "2019",
    "attributes": [""],
    "description": "Combination of destination and destinationType is Invalid",
    "explaination": "For Route Events, the following destinationType and destination combinations are required: ??   If destinationType is F, the destination must be the IMID of an Industry Member. Must be valid for the Event Date. ??   If destinationType is E, the destination must be one of the allowable values.",
    "type": "Error"
  },
  {
    "code": "2020",
    "attributes": [""],
    "description": "Missing or Invalid destinationType",
    "explaination": "destinationType must be populated with one of the allowable values.",
    "type": "Error"
  },
  {
    "code": "2021",
    "attributes": [""],
    "description": "Missing or Invalid displayPrice",
    "explaination": "When required, displayPrice must be in the correct format.",
    "type": "Error"
  },
  {
    "code": "2022",
    "attributes": [""],
    "description": "Missing or Invalid displayQty",
    "explaination": "When required, displayQty must be in the correct format.",
    "type": "Error"
  },
  {
    "code": "2023",
    "attributes": [""],
    "description": "Missing or Invalid dupROIDCond",
    "explaination": "dupROIDCond must be populated with one of the allowable values.",
    "type": "Error"
  },
  {
    "code": "2024",
    "attributes": [""],
    "description": "Missing or Invalid electronicDupFlag",
    "explaination": "electronicDupFlag must be populated and is one of the allowable values.",
    "type": "Error"
  },
  {
    "code": "2025",
    "attributes": [""],
    "description": "Invalid electronicTimestamp",
    "explaination": "electronicTimestamp must be in the correct format.",
    "type": "Error"
  },
  {
    "code": "2026",
    "attributes": [""],
    "description": "Missing or Invalid errorROEID",
    "explaination": "errorROEID must be blank when the actionType is ???NEW???; must be populated when actionType is ???RPR???.",
    "type": "Error"
  },
  {
    "code": "2027",
    "attributes": [""],
    "description": "Missing or Invalid eventTimestamp",
    "explaination": "eventTimestamp must be in the correct format. If manualFlag is true, eventTimestamp must be reported in increments of at least one second. If manualFlag is false, eventTimestamp must be reported in increments of at least milliseconds.",
    "type": "Error"
  },
  {
    "code": "2028",
    "attributes": [""],
    "description": "Combination of exchOriginCode and destinationType is invalid",
    "explaination": "For Option Order Route events, the following exchOriginCode and destinationType combination are required: ??   If destinationType is not E, exchOriginCode must be blank. ??   If destinationType is E, exchOriginCode must be populated.",
    "type": "Error"
  },
  {
    "code": "2030",
    "attributes": [""],
    "description": "Missing or Invalid fillKeyDate",
    "explaination": "fillKeyDate must be populated in the correct format.",
    "type": "Error"
  },
  {
    "code": "2031",
    "attributes": [""],
    "description": "Missing or Invalid firmDesignatedID",
    "explaination": "When required, firmDesignatedID must be in the correct format and unique among all identifiers from any given Industry Member for each business date.",
    "type": "Error"
  },
  {
    "code": "2032",
    "attributes": [""],
    "description": "Missing or Invalid firmROEID",
    "explaination": "firmROEID must be populated and in the correct format.",
    "type": "Error"
  },
  {
    "code": "2033",
    "attributes": [""],
    "description": "Invalid Event Date in the firmROEID",
    "explaination": "The Event Date portion of the firmROEID must be in the correct format and must equal the date portion of eventTimestamp.",
    "type": "Error"
  },
  {
    "code": "2034",
    "attributes": [""],
    "description": "Missing or Invalid fulfillmentID",
    "explaination": "fulfillmentID must be populated in the correct format.",
    "type": "Error"
  },
  {
    "code": "2035",
    "attributes": [""],
    "description": "Missing or Invalid fulfillmentLinkType",
    "explaination": "fulfillmentLinkType must be populated with one of the allowable values.",
    "type": "Error"
  },
  {
    "code": "2036",
    "attributes": [""],
    "description": "Invalid handlingInstructions",
    "explaination": "handlingInstructions must be in the correct format and must include allowable values. Name and value must be provided when applicable.",
    "type": "Error"
  },
  {
    "code": "2037",
    "attributes": [""],
    "description": "Invalid infoBarrierID",
    "explaination": "infoBarrierID must be in the correct format.",
    "type": "Error"
  },
  {
    "code": "2038",
    "attributes": [""],
    "description": "Missing or Invalid initiator",
    "explaination": "initiator must be populated with one of the allowable values.",
    "type": "Error"
  },
  {
    "code": "2039",
    "attributes": [""],
    "description": "Missing or Invalid isolnd",
    "explaination": "When required, isolnd value must be one of the allowable values.",
    "type": "Error"
  },
  {
    "code": "2040",
    "attributes": [""],
    "description": "Missing or Invalid leavesQty",
    "explaination": "When required, leavesQty must be in the correct format, and must be less than or equal to quantity.",
    "type": "Error"
  },
  {
    "code": "2041",
    "attributes": [""],
    "description": "Missing or Invalid manualFlag",
    "explaination": "manualFlag must be one of the allowable values.",
    "type": "Error"
  },
  {
    "code": "2042",
    "attributes": [""],
    "description": "Missing or Invalid manualOrderKeyDate",
    "explaination": "manualOrderKeyDate must be in the correct format; required if manualOrderID is populated.",
    "type": "Error"
  },
  {
    "code": "2043",
    "attributes": [""],
    "description": "Missing or Invalid manualOrderID",
    "explaination": "manualOrderID must be in the correct format.",
    "type": "Error"
  },
  {
    "code": "2044",
    "attributes": [""],
    "description": "Missing or Invalid marketCenterID",
    "explaination": "When required, marketCenterID must be one of the allowable values.",
    "type": "Error"
  },
  {
    "code": "2045",
    "attributes": [""],
    "description": "Invalid minQty",
    "explaination": "minQty must be in the correct format, must be greater than zero, and must be less than or equal to quantity.",
    "type": "Error"
  },
  {
    "code": "2046",
    "attributes": [""],
    "description": "Invalid mpStatusCode",
    "explaination": "mpStatusCode must be one of the allowable values.",
    "type": "Error"
  },
  {
    "code": "2047",
    "attributes": [""],
    "description": "Missing or Invalid nbboSource",
    "explaination": "When required, nbboSource must be one of the allowable values.",
    "type": "Error"
  },
  {
    "code": "2048",
    "attributes": [""],
    "description": "Missing or Invalid nbboTimestamp",
    "explaination": "When required, nbboTimestamp must be in the correct format.",
    "type": "Error"
  },
  {
    "code": "2049",
    "attributes": [""],
    "description": "Missing or Invalid nbbPrice",
    "explaination": "When required, nbbPrice must be in the correct format.",
    "type": "Error"
  },
  {
    "code": "2050",
    "attributes": [""],
    "description": "Missing or Invalid nbbQty",
    "explaination": "When required, nbbQty must be in the correct format.",
    "type": "Error"
  },
  {
    "code": "2051",
    "attributes": [""],
    "description": "Missing or Invalid nboPrice",
    "explaination": "When required, nboPrice must be in the correct format.",
    "type": "Error"
  },
  {
    "code": "2052",
    "attributes": [""],
    "description": "Missing or Invalid nboQty",
    "explaination": "When required, nboQty must be in the correct format.",
    "type": "Error"
  },
  {
    "code": "2053",
    "attributes": [""],
    "description": "Missing or Invalid negotiatedTradeFlag",
    "explaination": "negotiatedTradeFlag must be populated and one of the allowable values.",
    "type": "Error"
  },
  {
    "code": "2054",
    "description": "Missing or Invalid sideDetailsInd",
    "explaination": "sideDetailsInd must be populated with one of the allowable values.",
    "type": "Error"
  },
  {
    "code": "2055",
    "description": "Invalid nextUnlinked",
    "explaination": "nextUnlinked must be one of the allowable values.",
    "type": "Error"
  },
  {
    "code": "2056",
    "description": "Missing or Invalid onlyOneQuoteFlag",
    "explaination": "onlyOneQuoteFlag must be populated with one of the allowable values if required to populate.",
    "type": "Error"
  },
  {
    "code": "2057",
    "description": "Missing or Invalid openCloseIndicator",
    "explaination": "When required, openCloseIndicator must be one of the allowable values.",
    "type": "Error"
  },
  {
    "code": "2058",
    "description": "Missing or Invalid optionID",
    "explaination": "optionID must be populated in the correct format.",
    "type": "Error"
  },
  {
    "code": "2060",
    "description": "optionID not effective on Event Date",
    "explaination": "optionID is not effective on the event date.",
    "type": "Error"
  },
  {
    "code": "2061",
    "description": "Missing or Invalid orderID",
    "explaination": "orderID must be populated in the correct format.",
    "type": "Error"
  },
  {
    "code": "2062",
    "description": "Missing or Invalid orderType",
    "explaination": "orderType must be populated one of the allowable values.",
    "type": "Error"
  },
  {
    "code": "2063",
    "description": "Missing or Invalid orderKeyDate",
    "explaination": "orderKeyDate must be populated and in the correct format.",
    "type": "Error"
  },
  {
    "code": "2064",
    "description": "Missing or Invalid originatingIMID",
    "explaination": "If populated, originatingIMID must be in the correct format on all secondary events. Must be valid for the Event Date.",
    "type": "Error"
  },
  {
    "code": "2065",
    "description": "Missing or Invalid parentOrderID",
    "explaination": "parentOrderID must be populated in the correct format.",
    "type": "Error"
  },
  {
    "code": "2066",
    "description": "Missing or Invalid parentOrderKeyDate",
    "explaination": "parentOrderKeyDate must be populated in the correct format.",
    "type": "Error"
  },
  {
    "code": "2067",
    "description": "Missing or Invalid price",
    "explaination": "price must be in the correct format.",
    "type": "Error"
  },
  {
    "code": "2068",
    "description": "Missing or Invalid priorFillKeyDate",
    "explaination": "When required, priorFillKeyDate must be populated and in the correct format.",
    "type": "Error"
  },
  {
    "code": "2070",
    "description": "Missing or Invalid priorFulfillmentID",
    "explaination": "When required, priorFulfillmentID must be in the correct format.",
    "type": "Error"
  },
  {
    "code": "2071",
    "description": "Missing or Invalid priorOrderID",
    "explaination": "When required, priorOrderID must be populated in the correct format.",
    "type": "Error"
  },
  {
    "code": "2072",
    "description": "Missing or Invalid priorOrderKeyDate",
    "explaination": "When required, priorOrderKeyDate must be populated in the correct format.",
    "type": "Error"
  },
  {
    "code": "2073",
    "description": "Missing or Invalid priorQuoteKeyDate",
    "explaination": "When required, priorQuoteKeyDate must be populated in the correct format.",
    "type": "Error"
  },
  {
    "code": "2074",
    "description": "Missing or Invalid priorQuoteID",
    "explaination": "When required, priorQuoteID must populated and must be in the correct format.",
    "type": "Error"
  },
  {
    "code": "2075",
    "description": "Invalid priorUnlinked",
    "explaination": "priorUnlinked value must be one of the allowable values.",
    "type": "Error"
  },
  {
    "code": "2076",
    "description": "Missing or Invalid quantity",
    "explaination": "quantity must be in the correct format.",
    "type": "Error"
  },
  {
    "code": "2077",
    "description": "Missing or Invalid quoteID",
    "explaination": "quoteID must be populated in the correct format.",
    "type": "Error"
  },
  {
    "code": "2078",
    "description": "Missing or Invalid quoteKeyDate",
    "explaination": "quoteKeyDate must be populated and in the correct format.",
    "type": "Error"
  },
  {
    "code": "2080",
    "description": "Missing or Invalid quoteRejectedFlag",
    "explaination": "When required, quoteRejectedFlag must be populated in one of the allowable values.",
    "type": "Error"
  },
  {
    "code": "2081",
    "description": "Missing or Invalid receivedQuoteID",
    "explaination": "receivedQuoteID must be populated in the correct format.",
    "type": "Error"
  },
  {
    "code": "2082",
    "description": "Missing or Invalid receiverIMID",
    "explaination": "receiverIMID must be populated in the correct format. Must be valid for the Event Date.",
    "type": "Error"
  },
  {
    "code": "2083",
    "description": "Missing or Invalid receivingDeskType",
    "explaination": "receivingDeskType must be populated in one of the allowable values.",
    "type": "Error"
  },
  {
    "code": "2084",
    "description": "Invalid reportingExceptionCode",
    "explaination": "reportingExceptionCode must be one of the allowable values.",
    "type": "Error"
  },
  {
    "code": "2085",
    "description": "Missing or Invalid representativeInd",
    "explaination": "representativeInd must be populated in one of the allowable values.",
    "type": "Error"
  },
  {
    "code": "2086",
    "description": "Invalid routedOrderID",
    "explaination": "routedOrderID must be populated in the correct",
    "type": "Error"
  },
  {
    "code": "2087",
    "description": "Invalid routedQuoteID",
    "explaination": "When required, routedQuoteID must be populated in the correct format.",
    "type": "Error"
  },
  {
    "code": "2088",
    "description": "Invalid routeRejectedFlag",
    "explaination": "routeRejectedFlag must be one of the allowable values.",
    "type": "Error"
  },
  {
    "code": "2089",
    "description": "Combination of senderType and senderIMID is invalid",
    "explaination": "If senderType = F, senderIMID is the IMID of an Industry Member. If senderType = E, senderIMID must be one of the allowable values.",
    "type": "Error"
  },
  {
    "code": "2090",
    "description": "Missing or Invalid senderType",
    "explaination": "When required, senderType must be one of the allowable values.",
    "type": "Error"
  },
  {
    "code": "2091",
    "description": "Missing or Invalid senderIMID",
    "explaination": "When required, senderIMID must be populated in the correct format. Must be valid for the Event Date.",
    "type": "Error"
  },
  {
    "code": "2092",
    "description": "Missing or Invalid seqNum",
    "explaination": "When required, seqNum must be in the correct format.",
    "type": "Error"
  },
  {
    "code": "2093",
    "description": "Missing or Invalid session",
    "explaination": "When required, session must populated. Required when destinationType is E.",
    "type": "Error"
  },
  {
    "code": "2095",
    "description": "Missing or Invalid side",
    "explaination": "side must be populated in one of the allowable values.",
    "type": "Error"
  },
  {
    "code": "2096",
    "description": "Missing or Invalid symbol",
    "explaination": "symbol must be populated in the correct format.",
    "type": "Error"
  },
  {
    "code": "2098",
    "description": "symbol not effective on Event Date",
    "explaination": "symbol is not effective on the event date.",
    "type": "Error"
  },
  {
    "code": "2099",
    "description": "symbol does not match listing market format",
    "explaination": "For exchange listed securities, the symbol format must match the format published by the primary listing market.",
    "type": "Error"
  },
  {
    "code": "2100",
    "description": "Invalid tapeTradeID",
    "explaination": "If populated, tapeTradeID must be in the correct format.",
    "type": "Error"
  },
  {
    "code": "2101",
    "description": "Missing or Invalid timeInForce",
    "explaination": "timeInForce value must be populated in the correct format. Name and value must be provided when applicable.",
    "type": "Error"
  },
  {
    "code": "2102",
    "description": "Missing or Invalid tradeID",
    "explaination": "tradeID must be populated in the correct format.",
    "type": "Error"
  },
  {
    "code": "2103",
    "description": "Missing or Invalid tradeKeyDate",
    "explaination": "tradeKeyDate must be populated in the correct format.",
    "type": "Error"
  },
  {
    "code": "2104",
    "description": "Missing or Invalid tradingSession",
    "explaination": "tradingSession must be populated in one of the allowable values.",
    "type": "Error"
  },
  {
    "code": "2105",
    "description": "Missing or Invalid type",
    "explaination": "For each event type, type must be populated and one of the allowable values.",
    "type": "Error"
  },
  {
    "code": "2106",
    "description": "Missing or Invalid unsolicitedInd",
    "explaination": "unsolicitedInd must be populated in one of the allowable values.",
    "type": "Error"
  },
  {
    "code": "2107",
    "description": "Invalid workingPrice",
    "explaination": "workingPrice must be blank if atsDisplayInd is blank. When required, workingPrice must be populated in the correct format if atsDisplayInd is populated. If no workingPrice is applicable, it must be 0.",
    "type": "Error"
  },
  {
    "code": "2108",
    "description": "Missing or Invalid buyDetails",
    "explaination": "If sideDetailsInd = BUY, buyDetails must be populated. If sideDetailsInd = SELL, buyDetails must not be populated.",
    "type": "Error"
  },
  {
    "code": "2109",
    "description": "Missing or Invalid orderID in buyDetails",
    "explaination": "When required, orderID must be populated in the correct format.",
    "type": "Error"
  },
  {
    "code": "2110",
    "description": "Missing or Invalid orderKeyDate in buyDetails",
    "explaination": "When required, orderKeyDate must be populated in the correct format.",
    "type": "Error"
  },
  {
    "code": "2111",
    "description": "Missing or Invalid side in buyDetails",
    "explaination": "side must be populated in the correct format.",
    "type": "Error"
  },
  {
    "code": "2112",
    "description": "Missing or Invalid firmDesignatedID in buyDetails",
    "explaination": "When required, firmDesignatedID must be populated in the correct format.",
    "type": "Error"
  },
  {
    "code": "2113",
    "description": "Missing or Invalid accountHolderType in buyDetails",
    "explaination": "When required, accountHolderType must be one of the allowable values.",
    "type": "Error"
  },
  {
    "code": "2114",
    "description": "Invalid combination of firmDesignatedID and orderID in buyDetails",
    "explaination": "When required, the combination of firmDesignatedID and orderID in buyDetails must be valid. See section Trade Side Details for more details.",
    "type": "Error"
  },
  {
    "code": "2115",
    "description": "Missing or Invalid sellDetails",
    "explaination": "If sideDetailsInd = SELL, sellDetails must be populated. If sideDetailsInd = BUY, sellDetails must not be populated.",
    "type": "Error"
  },
  {
    "code": "2116",
    "description": "Missing or Invalid orderID in sellDetails",
    "explaination": "When required, orderID must be populated in the correct format.",
    "type": "Error"
  },
  {
    "code": "2117",
    "description": "Missing or Invalid orderKeyDate in sellDetails",
    "explaination": "When required, orderKeyDate must be populated in the correct format.",
    "type": "Error"
  },
  {
    "code": "2118",
    "description": "Missing or Invalid side in sellDetails",
    "explaination": "side must be populated in the correct format.",
    "type": "Error"
  },
  {
    "code": "2119",
    "description": "Missing or Invalid firmDesignatedID in sellDetails",
    "explaination": "When required, firmDesignatedID must be populated in the correct format.",
    "type": "Error"
  },
  {
    "code": "2120",
    "description": "Missing or Invalid accountHolderType in sellDetails",
    "explaination": "When required, accountHolderType must be populated in the correct format.",
    "type": "Error"
  },
  {
    "code": "2121",
    "description": "Missing or Invalid orderID in clientDetails",
    "explaination": "orderID must be populated in the correct format.",
    "type": "Error"
  },
  {
    "code": "2122",
    "description": "Missing or Invalid orderKeyDate in clientDetails",
    "explaination": "orderKeyDate must be populated in the correct format.",
    "type": "Error"
  },
  {
    "code": "2123",
    "description": "Missing or Invalid side in clientDetails",
    "explaination": "side must be populated in the correct format.",
    "type": "Error"
  },
  {
    "code": "2124",
    "description": "Invalid firmDesignatedID in clientDetails",
    "explaination": "firmDesignatedID must be blank.",
    "type": "Error"
  },
  {
    "code": "2125",
    "description": "Invalid accountHolderType in clientDetails",
    "explaination": "accountHolderType must be blank.",
    "type": "Error"
  },
  {
    "code": "2126",
    "description": "Missing or Invalid orderID in firmDetails",
    "explaination": "When required, orderID must be populated and in the correct format.",
    "type": "Error"
  },
  {
    "code": "2127",
    "description": "Missing or Invalid orderKeyDate in firmDetails",
    "explaination": "When required, orderKeyDate must be populated in the correct format.",
    "type": "Error"
  },
  {
    "code": "2128",
    "description": "Missing or Invalid side in firmDetails",
    "explaination": "side must be populated and in the correct format.",
    "type": "Error"
  },
  {
    "code": "2129",
    "description": "Missing or Invalid firmDesignatedID in firmDetails",
    "explaination": "When required, firmDesignatedID must be in the correct format.",
    "type": "Error"
  },
  {
    "code": "2130",
    "description": "Missing or Invalid accountHolderType in firmDetails",
    "explaination": "When required, accountHolderType must be one of the allowable values.",
    "type": "Error"
  },
  {
    "code": "2132",
    "description": "Record exceeds maximum length",
    "explaination": "Record length must not exceed the maximum length for each record.",
    "type": "Error"
  },
  {
    "code": "2133",
    "description": "Additional fields are specified in the record but are not defined for this CAT event type",
    "explaination": "Refer to section 4 & 5 for permitted fields for each CAT event type.",
    "type": "Error"
  },
  {
    "code": "2134",
    "description": "Invalid JSON or CSV format",
    "explaination": "The record is not represented in a valid format as specified in Section 2.5 Data Types.",
    "type": "Error"
  },
  {
    "code": "2136",
    "description": "Invalid Alphanumeric Character",
    "explaination": "A field value in the record contains a delimiter or a non-allowable ASCII character",
    "type": "Error"
  },
  {
    "code": "2137",
    "description": "Invalid correction, deletion or a repair",
    "explaination": "actionType ???COR???, ???RPR??? or ???DEL??? is received for a firmROEID or an errorROEID that does not exist in CAT.",
    "type": "Error"
  },
  {
    "code": "2139",
    "description": "eventTimestamp is greater than the current date and time",
    "explaination": "The eventTimestamp is greater than system date.",
    "type": "Error"
  },
  {
    "code": "2142",
    "description": "Invalid combination of aggregatedOrders and representativeInd",
    "explaination": "The combination of aggregatedOrders and representativeInd must be valid. See Appendix C for more details on reporting representative and combined orders.",
    "type": "Error"
  },
  {
    "code": "2143",
    "description": "Invalid combination of electronicDupFlag and manualFlag",
    "explaination": "The combination of electronicDupFlag and manualFlag must be valid. See section 3.2.2 for more details.",
    "type": "Error"
  },
  {
    "code": "2144",
    "description": "Invalid combination of electronicTimestamp and manualFlag",
    "explaination": "The combination of electronicTimestamp and manualFlag must be valid. See section 3.2.2 for more details.",
    "type": "Error"
  },
  {
    "code": "2145",
    "description": "Invalid combination of fulfillmentLinkType and firmDetails",
    "explaination": "The combination of fulfillmentLinkType and firmDetails must be valid. See Appendix C for more details on reporting representative and combined orders.",
    "type": "Error"
  },
  {
    "code": "2146",
    "description": "Missing or Invalid clientDetails",
    "explaination": "clientDetails must be populated in the correct format.",
    "type": "Error"
  },
  {
    "code": "2148",
    "description": "Invalid combination of firmDesignatedID and orderID in sellDetails",
    "explaination": "When required, the combination of firmDesignatedID and orderID in sellDetails must be valid. See section Trade Side Details for more details.",
    "type": "Error"
  },
  {
    "code": "2149",
    "description": "CATReporterIMID and senderIMID must be assigned to the same firm",
    "explaination": "CATReporterIMID and senderIMID must be assigned to the same firm.",
    "type": "Error"
  },
  {
    "code": "2150",
    "description": "CATReporterIMID and receiverIMID must be assigned to the same firm",
    "explaination": "CATReporterIMID and receiverIMID must be assigned to the same firm.",
    "type": "Error"
  },
  {
    "code": "2151",
    "description": "Firm provided record count in meta file does not equal row count in the data file",
    "explaination": "The record count in the data file as calculated by CAT does not match the record count provided in the metadata file.",
    "type": "Error"
  },
  {
    "code": "2153",
    "description": "Data File is not Readable",
    "explaination": "Data file format is not readable as it contains an invalid compression format.",
    "type": "Error"
  },
  {
    "code": "2154",
    "description": "Invalid quoteWantedInd",
    "explaination": "When required, quoteWantedInd must be populated in one of the allowable values.",
    "type": "Error"
  },
  {
    "code": "2156",
    "description": "Invalid reservedForFutureUse",
    "explaination": "reservedForFutureUse must not be populated.",
    "type": "Error"
  },
  {
    "code": "2157",
    "description": "Invalid quantity in buyDetails",
    "explaination": "If populated, quantity in buyDetails must be in the correct format.",
    "type": "Error"
  },
  {
    "code": "2158",
    "description": "Invalid originatingIMID in buyDetails",
    "explaination": "If populated, originatingIMID in buyDetails must be in the correct format.",
    "type": "Error"
  },
  {
    "code": "2159",
    "description": "Invalid quantity in sellDetails",
    "explaination": "If populated, quantity in sellDetails must be in the correct format.",
    "type": "Error"
  },
  {
    "code": "2160",
    "description": "Invalid originatingIMID in sellDetails",
    "explaination": "If populated, originatingIMID in sellDetails must be in the correct format.",
    "type": "Error"
  },
  {
    "code": "2161",
    "description": "Invalid quantity in clientDetails",
    "explaination": "If populated, quantity in clientDetails must be in the correct format.",
    "type": "Error"
  },
  {
    "code": "2162",
    "description": "Invalid originatingIMID in clientDetails",
    "explaination": "If populated, originatingIMID in clientDetails must be in the correct format.",
    "type": "Error"
  },
  {
    "code": "2163",
    "description": "Invalid quantity in firmDetails",
    "explaination": "If populated, quantity in firmDetails must be in the correct format.",
    "type": "Error"
  },
  {
    "code": "2164",
    "description": "Invalid originatingIMID in firmDetails",
    "explaination": "If populated, originatingIMID in firmDetails must be in the correct format",
    "type": "Error"
  },
  {
    "code": "2165",
    "description": "Missing or Invalid orderID in aggregatedOrders",
    "explaination": "When required, orderID in aggregatedOrders must be populated in the correct format.",
    "type": "Error"
  },
  {
    "code": "2166",
    "description": "Missing or Invalid orderKeyDate in aggregatedOrders",
    "explaination": "When required, orderKeyDate in aggregated orders must be populated in the correct format.",
    "type": "Error"
  },
  {
    "code": "2167",
    "description": "Invalid quantity in aggregatedOrders",
    "explaination": "If populated, quantity in aggregatedOrders must be in the correct format.",
    "type": "Error"
  },
  {
    "code": "2168",
    "description": "Invalid originatingIMID in aggregatedOrders",
    "explaination": "If populated, originatingIMID in aggregatedOrders must be in correct format.",
    "type": "Error"
  },
  {
    "code": "2169",
    "description": "Invalid combination of reportingExceptionCode and tapeTradeID",
    "explaination": "The combination of reportingExceptionCode and tapeTradeID must be valid. Refer to section 4.12. for more details.",
    "type": "Error"
  },
  {
    "code": "2801",
    "description": "",
    "explaination": "Reserved",
    "type": ""
  },
  {
    "code": "2802",
    "description": "",
    "explaination": "Reserved",
    "type": ""
  },
  {
    "code": "2803",
    "description": "",
    "explaination": "Reserved",
    "type": ""
  },
  {
    "code": "2999",
    "description": "Exceeds Max Error Limit",
    "explaination": "The record contains more than 8 errors.",
    "type": "Error"
  },
  {
    "code": "3002",
    "description": "Duplicate firmROEID on same day",
    "explaination": "Duplicate firmROEID received by CAT; must be unique for the Event Date and CAT Reporter IMID.",
    "type": "Error"
  },
  {
    "code": "3003",
    "description": "Duplicate firmROEID on a prior processing day",
    "explaination": "One or more events were reported with the same firmROEID as an event reported on a previous day. All events received on the current CAT Processing Date associated with the duplicate firmROEID will be rejected. The events received on a previous day associated with the duplicate firmROEID will not be rejected. This is only applicable to events with an actionType of ???NEW???.",
    "type": "Error"
  },
  {
    "code": "3004",
    "description": "Duplicate Order Key reported on same day",
    "explaination": "More than one primary order event was reported with the same Order Key on the current CAT Processing Date. All events associated with the duplicate Order Key will be rejected.",
    "type": "Error"
  },
  {
    "code": "3007",
    "description": "Duplicate Order Key reported on a prior processing day",
    "explaination": "One or more primary order events were reported that have the same Order Key as an order reported on a previous day. All events received on the current CAT Processing Date associated with the duplicate Order Key will be rejected. The events received on a previous day associated with the duplicate Order Key will not be rejected.",
    "type": "Error"
  },
  {
    "code": "3008",
    "description": "Duplicate Route Linkage Key reported on the same day",
    "explaination": "More than one Order Route event was reported with the same Route Linkage Key on the current CAT Processing Date. All events with a duplicate Route Linkage Key will be rejected.",
    "type": "Error"
  },
  {
    "code": "3009",
    "description": "Duplicate Route Linkage Key reported on prior processing day",
    "explaination": "One or more Order Route events were reported that have the same Route Linkage Key as an event reported on a previous day. All events received on the current CAT Processing Date with a duplicate Route Linkage Key will be rejected. The events received on a previous day with a duplicate Route Linkage will not be rejected.",
    "type": "Error"
  },
  {
    "code": "3010",
    "description": "Duplicate Trade Key reported on same day",
    "explaination": "More than one Trade event was reported with the same Trade Key on the current CAT Processing Date. All events associated with the duplicate Trade Key will be rejected.",
    "type": "Error"
  },
  {
    "code": "3011",
    "description": "Duplicate Trade Key reported on prior processing day",
    "explaination": "One or more Trade events were reported with the same Trade Key as an event reported on a previous day. All events received on the current CAT Processing Date with a duplicate Trade Key will be rejected. The events received on a previous day associated with the duplicate Trade Key will not be rejected.",
    "type": "Error"
  },
  {
    "code": "3012",
    "description": "Duplicate Fulfillment Key reported on same day",
    "explaination": "More than one Fulfillment events were reported with the same Fulfillment Key on the current CAT Processing Date. All events with a duplicate Fulfillment Key will be rejected.",
    "type": "Error"
  },
  {
    "code": "3015",
    "description": "Duplicate Fulfillment Key reported on prior processing day",
    "explaination": "One or more Fulfillment events was reported with the same Fulfillment Key as an event reported on a previous day. All events received on the current CAT Processing Date associated with the duplicate Fulfillment Key will be rejected. The events received on a previous day with a duplicate Fulfillment Key will not be rejected.",
    "type": "Error"
  },
  {
    "code": "3016",
    "description": "Duplicate Quote Key reported on same day",
    "explaination": "More than one New Quote event were reported with the same Quote Key on the current CAT Processing Date. All events associated with the duplicate Quote Key will be rejected.",
    "type": "Error"
  },
  {
    "code": "3017",
    "description": "Duplicate Quote Key reported on prior processing day",
    "explaination": "One or more New Quote events were reported that have the same Quote Key as an event reported on a previous day. All events received on the current CAT Processing Date associated with the duplicate Quote Key will be rejected. The events received on a previous day associated with the duplicate Quote Key will not be rejected.",
    "type": "Error"
  },
  {
    "code": "3018",
    "description": "Duplicate Manual Order Key reported on same day",
    "explaination": "More than one primary order event was reported with the same Manual Order Key on the current CAT Processing Date. All events associated with the duplicate Manual Order Key will be rejected.",
    "type": "Error"
  },
  {
    "code": "3019",
    "description": "Duplicate Manual Order Key reported on prior processing day",
    "explaination": "One or more primary order events were reported that have the same Manual Order Key as an order reported on a previous day. All events received on the current CAT Processing Date associated with the duplicate Manual Order Key will be rejected. The events received on a previous day associated with the duplicate Manual Order Key will not be rejected.",
    "type": "Error"
  },
  {
    "code": "3501",
    "description": "Secondary Event ??? Order Key, Trade Key, Quote Key or Fulfillment Key not found",
    "explaination": "The Secondary Event (as defined in Appendix F) references an Order Key, Trade Key, Quote Key or Fulfillment Key that does not exist in CAT because it was not reported or was rejected.",
    "type": "Error"
  },
  {
    "code": "3502",
    "description": "Trade Event ???Order not found",
    "explaination": "The Trade Event side details reference an Order Key that does not exist in CAT because it was not reported or was rejected.",
    "type": "Error"
  },
  {
    "code": "3503",
    "description": "Fulfillment Event ???Order not found",
    "explaination": "The Fulfillment Event side details reference an Order Key that does not exist in CAT because it was not reported or was rejected.",
    "type": "Error"
  },
  {
    "code": "3504",
    "description": "Aggregated Order ??? Client order not found",
    "explaination": "Aggregated order references an Order Key that does not exist in CAT because it was not reported or was rejected.",
    "type": "Error"
  },
  {
    "code": "3505",
    "description": "Electronic Duplicate Order ??? Manual order not found",
    "explaination": "Electronic duplicate order references a Manual Order Key that does not exist in CAT because it was not reported or was rejected.",
    "type": "Error"
  },
  {
    "code": "3601",
    "description": "Intrafirm Out of Sequence Event",
    "explaination": "eventTimestamp of a Secondary Event (as defined in Appendix F) is prior to the eventTimestamp of the related Primary Event (as defined in Appendix F). When comparing eventTimestamp, the Clock Drift allowance as specified in Appendix B must be considered.",
    "type": "Error"
  },
  {
    "code": "3602",
    "description": "Mismatched eventTimestamp on the Order/Modification/Trade supplement event",
    "explaination": "eventTimestamp on the Order/Modification/Trade supplement event did not match the eventTimestamp on the corresponding Order/Modification/Trade event. Timestamp compared up to milliseconds.",
    "type": "Error"
  },
  {
    "code": "4003",
    "description": "Matching tapeTradeID cannot be found",
    "explaination": "The tapeTradeID reported on a Trade event did not match the unique identifier (e.g., Branch Sequence Number, Compliance ID) provided on the TRF/ADF/ORF Trade Report.",
    "type": "Error"
  },
  {
    "code": "4005",
    "description": "eventTimestamp cannot be found",
    "explaination": "The eventTimestamp reported on the Trade event did not match the Execution Time on the TRF/ADF/ORF trade report.",
    "type": "Error"
  },
  {
    "code": "4007",
    "description": "symbol cannot be found",
    "explaination": "The symbol reported on the Trade event did not match the symbol on the TRF/ADF/ORF trade report.",
    "type": "Error"
  },
  {
    "code": "4009",
    "description": "Multiple fields did not match",
    "explaination": "A TRF/ADF/ORF Trade Report with a matching unique identifier (i.e. Branch Sequence Number) was found; however, the symbol, CATReporterIMID or a combination of fields reported on the Trade event did not match the corresponding symbol or reporting/contra firm on the TRF/ADF/ORF Trade Report.",
    "type": "Error"
  },
  {
    "code": "5004",
    "description": "Named - Matching tapeTradeID cannot be found",
    "explaination": "Named on a TRF/ADF/ORF Trade Report, but the tapeTradeID on the Trade event did not match the unique identifier (e.g., Branch Sequence Number, Compliance ID) on the corresponding TRF/ADF/ORF Trade Report.",
    "type": "Error"
  },
  {
    "code": "5006",
    "description": "Named - eventTimestamp cannot be found",
    "explaination": "Named on a TRF/ADF/ORF Trade Report, but the eventTimestamp reported on the Trade event did not match the Execution Time on the corresponding Trade event.",
    "type": "Error"
  },
  {
    "code": "5008",
    "description": "Named - symbol cannot be found",
    "explaination": "Named on a TRF/ADF/ORF Trade Report, but the symbol reported on the Trade event did not match the symbol on the TRF/ADF/ORF trade report.",
    "type": "Error"
  },
  {
    "code": "5010",
    "description": "Named - Multiple fields did not match",
    "explaination": "Named on a TRF/ADF/ORF Trade Report and a matching tapeTradeID on the CAT Trade Event was found; however, the symbol, CATReporterIMID or a combination of fields reported on the Trade event did not match the corresponding symbol or reporting/contra firm on the TRF/ADF/ORF Trade Report.",
    "type": "Error"
  },
  {
    "code": "6003",
    "description": "Matching routedOrderID cannot be found",
    "explaination": "The routedOrderID reported on the Order Route event does not match to a corresponding routedOrderID on the exchange order.",
    "type": "Error"
  },
  {
    "code": "6005",
    "description": "senderIMID did not match",
    "explaination": "A matching routedOrderID was identified on the exchange order; however, the senderIMID on the Order Route event did not match the corresponding routingParty on the exchange order.",
    "type": "Error"
  },
  {
    "code": "6007",
    "description": "symbol did not match",
    "explaination": "A matching routedOrderID was identified in the exchange order; however, the symbol on the Order Route event did not match the corresponding symbol on the exchange order.",
    "type": "Error"
  },
  {
    "code": "6009",
    "description": "session did not match",
    "explaination": "A matching routedOrderID was identified on the exchange order; however, the session on the Order Route event did not match the session on the exchange order.",
    "type": "Error"
  },
  {
    "code": "6011",
    "description": "Multiple fields did not match",
    "explaination": "A matching routedOrderID was identified on the exchange order; however, the symbol, senderIMID, or a combination of fields reported on the Order Route event did not match the corresponding symbol, routingParty or a combination of fields on the exchange order.",
    "type": "Error"
  },
  {
    "code": "7004",
    "description": "Named - Matching routedOrderID cannot be found",
    "explaination": "Named on an exchange order, but the routedOrderID reported on the Order Route event does not match to a corresponding routedOrderID on the exchange order.",
    "type": "Error"
  },
  {
    "code": "7006",
    "description": "Named - senderIMID did not match",
    "explaination": "Named on an exchange order with a matching routedOrderID identified on the Order Route event; however, the senderIMID on the Order Route event did not match the routingParty reported on the corresponding exchange order.",
    "type": "Error"
  },
  {
    "code": "7008",
    "description": "Named - symbol did not match",
    "explaination": "Named on an exchange order with a matching routedOrderID identified on the Order Route event; however, the symbol on the Order Route event did not match the symbol on the corresponding exchange order.",
    "type": "Error"
  },
  {
    "code": "7010",
    "description": "Named - session did not match",
    "explaination": "Named on an exchange order with a matching routedOrderID identified on the Order Route event; however, the session on the Order Route event did not match the session on the corresponding exchange order.",
    "type": "Error"
  },
  {
    "code": "7012",
    "description": "Named - Multiple fields did not match",
    "explaination": "Named on an Order Route event with a matching routedOrderID identified in the Order Route event; however, the symbol, senderIMID or a combination of fields reported on the Order Route event did not match the symbol or routingParty on the corresponding exchange order.",
    "type": "Error"
  },
  {
    "code": "8003",
    "description": "Matching routedOrderID cannot be found",
    "explaination": "The routedOrderID reported on the Order Route event does not match to a corresponding routedOrderID on the Order Accepted event.",
    "type": "Error"
  },
  {
    "code": "8004",
    "description": "Named - Matching routedOrderID cannot be found",
    "explaination": "Named on an Order Route event, but the routedOrderID reported on the Order Accepted event does not match to a corresponding routedOrderID on the Order Route event.",
    "type": "Error"
  },
  {
    "code": "8005",
    "description": "senderIMID did not match",
    "explaination": "A matching routedOrderID was identified in the Order Accepted event; however, the senderIMID on the Order Route event did not match the senderIMID on the Order Accepted event.",
    "type": "Error"
  },
  {
    "code": "8006",
    "description": "Named - senderIMID did not match",
    "explaination": "Named on an Order Route event, but the senderIMID on the Order Accepted event does not match the senderIMID reported on the corresponding Order Route event.",
    "type": "Error"
  },
  {
    "code": "8007",
    "description": "destination did not match",
    "explaination": "A matching routedOrderID was identified in the Order Accepted event; however, the destination on the Order Route event did not match the receiverIMID on the Order Accepted event.",
    "type": "Error"
  },
  {
    "code": "8008",
    "description": "Named ??? destination did not match",
    "explaination": "Named on an Order Route event, but the receiverIMID on the Order Accepted event does not match the destination reported on the corresponding Order Route event.",
    "type": "Error"
  },
  {
    "code": "8009",
    "description": "symbol did not match",
    "explaination": "A matching routedOrderID was identified in the Order Accepted event; however, the symbol on the Order Route event did not match the symbol on the Order Accepted event.",
    "type": "Error"
  },
  {
    "code": "8010",
    "description": "Named - symbol did not match",
    "explaination": "Named on an Order Route event with a matching routedOrderID identified in the Order Accepted Event; however, the symbol on the Order Accepted event did not match the symbol on the Order Route event.",
    "type": "Error"
  },
  {
    "code": "8011",
    "description": "Multiple fields did not match",
    "explaination": "A matching routedOrderID was identified in the Order Accepted event; however, the symbol, senderIMID, destination, or a combination of fields on the Order Route event did not match the symbol, senderIMID, or receiverIMID on the Order Accepted Event.",
    "type": "Error"
  },
  {
    "code": "8012",
    "description": "Named - Multiple fields did not match",
    "explaination": "Named on an Order Route event with a matching routedOrderID identified in the Order Accepted Event; however, the symbol, senderIMID, receiverIMID or a combination of fields on the Order Accepted event did not match the corresponding symbol, senderIMID, or destination on the Order Route event.",
    "type": "Error"
  },
  {
    "code": "9003",
    "description": "Matching routedOrderID cannot be found",
    "explaination": "The routedOrderID reported on the Order Accepted event does not match to a corresponding routedOrderID on the Order Route event.",
    "type": "Error"
  },
  {
    "code": "9004",
    "description": "Named - Matching routedOrderID cannot be found",
    "explaination": "Named on an Order Accepted event, but the routedOrderID reported on the Order Route event does not match to a corresponding routedOrderID on the Order Accepted event.",
    "type": "Error"
  },
  {
    "code": "9005",
    "description": "senderIMID did not match",
    "explaination": "A matching routedOrderID was identified in the Order Route event; however, the senderIMID on the Order Accepted event did not match the senderIMID on the Order Route event.",
    "type": "Error"
  },
  {
    "code": "9006",
    "description": "Named - senderIMID did not match",
    "explaination": "Named on an Order Accepted event but the senderIMID reported on the Order Route does not match to a corresponding senderIMID on the Order Accepted event.",
    "type": "Error"
  },
  {
    "code": "9007",
    "description": "receiverIMID did not match",
    "explaination": "A matching routedOrderID was identified in the Order Route event; however, the receiverIMID on the Order Accepted event did not match the destination on the Order Route event.",
    "type": "Error"
  },
  {
    "code": "9008",
    "description": "Named - receiverIMID did not match",
    "explaination": "Named on an Order Accepted event but the destination reported on the Order Route does not match to a corresponding receiverIMID on the Order Accepted event.",
    "type": "Error"
  },
  {
    "code": "9009",
    "description": "symbol did not match",
    "explaination": "A matching routedOrderID was identified in the Order Route event; however, the symbol on the Order Accepted event did not match the symbol on the Order Route event.",
    "type": "Error"
  },
  {
    "code": "9010",
    "description": "Named - symbol did not match",
    "explaination": "Named on an Order Accepted event with a matching routedOrderID identified in the Order Route event; however, the symbol on the Order Route event did not match the symbol on the Order Accepted Event.",
    "type": "Error"
  },
  {
    "code": "9011",
    "description": "Multiple fields did not match",
    "explaination": "A matching routedOrderID was identified in the Order Route event; however, the symbol, senderIMID, receiverIMID, receiverIMID, or a combination of fields on the Order Accepted event did not match the corresponding symbol, senderIMID, or destination on the Order Route event.",
    "type": "Error"
  },
  {
    "code": "9012",
    "description": "Named - Multiple fields did not match",
    "explaination": "Named on an Order Accept Event with a matching routedOrderID identified in the Order Route event; however, the symbol, senderIMID, destination or a combination of fields on the Order Route event did not match the corresponding symbol, senderIMID, receiverIMID or a combination of fields on an Order Accepted event.",
    "type": "Error"
  },
  {
    "code": "399",
    "description": "Duplicate Event",
    "explaination": "The event has already been received by CAT. The first instance of the event will be retained; all subsequent submissions will be rejected. This rejection is not repairable.",
    "type": "Warning"
  },
  {
    "code": "398",
    "description": "Secondary Event ??? Order Key, Trade Key, Quote Key or Fulfillment Key prior to CAT go-live",
    "explaination": "The Secondary Event (as defined in Appendix F) references an Order Key, Trade Key, Quote Key or Fulfillment Key that does not exist in CAT because it references a date prior to CAT go-live.",
    "type": "Warning"
  },
  {
    "code": "397",
    "description": "Intrafirm Late Reported event",
    "explaination": "An Intrafirm event unmatched as it was reported to CAT beyond the processing window. This warning is not repairable.",
    "type": "Warning"
  },
  {
    "code": "499",
    "description": "Late Reported Trade event",
    "explaination": "A Trade event unmatched as it was reported to CAT beyond the processing window. This warning is not repairable.",
    "type": "Warning"
  },
  {
    "code": "498",
    "description": "Named - Late Reported Trade Report",
    "explaination": "Named on a TRF/ADF/ORF Trade Report that was reported beyond the processing window. This warning is not repairable.",
    "type": "Warning"
  },
  {
    "code": "799",
    "description": "Late reported Order Route event",
    "explaination": "An Order Route event unmatched as it was reported to CAT beyond the processing window. This warning is not repairable.",
    "type": "Warning"
  },
  {
    "code": "798",
    "description": "Named - Late reported exchange order",
    "explaination": "Named on an exchange order that was reported beyond the processing window. This warning is not repairable.",
    "type": "Warning"
  },
  {
    "code": "899",
    "description": "Late reported Order Route event",
    "explaination": "An Order Route event unmatched as it was reported to CAT beyond the processing window. This warning is not repairable.",
    "type": "Warning"
  },
  {
    "code": "898",
    "description": "Named - Late reported Order Route event",
    "explaination": "Named on an Order Route event that was reported beyond the processing window. This warning is not repairable.",
    "type": "Warning"
  },
  {
    "code": "897",
    "description": "Early reported Order Route event",
    "explaination": "An Order Route event unmatched as it was reported to CAT earlier than the due date. This warning is not repairable.",
    "type": "Warning"
  },
  {
    "code": "896",
    "description": "Named - Early reported Order Route event",
    "explaination": "Named on an Order Route event that was reported to CAT earlier than the due date; therefore, no Interfirm match was possible. This warning is not repairable.",
    "type": "Warning"
  },
  {
    "code": "895",
    "description": "Late reported Order Accepted event",
    "explaination": "An Order Accepted event unmatched as it was reported to CAT beyond the processing window. This warning is not repairable.",
    "type": "Warning"
  },
  {
    "code": "894",
    "description": "Named - Late reported Order Accepted event",
    "explaination": "Named on an Order Accepted event that was reported beyond the processing window. This warning is not repairable.",
    "type": "Warning"
  },
  {
    "code": "893",
    "description": "Early reported Order Accepted event",
    "explaination": "An Order Accepted event unmatched as it was reported to CAT earlier than the due date. This warning is not repairable.",
    "type": "Warning"
  },
  {
    "code": "892",
    "description": "Named - Early reported Order Accepted event",
    "explaination": "Named on an Order Accepted event that was reported to CAT earlier than the due date. This warning is not repairable.",
    "type": "Warning"
  }
]
