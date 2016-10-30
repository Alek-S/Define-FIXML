//==USER INTERFACE SIDE==
		$(document).ready(function(){
			$('button').on('click', function(event){
				event.preventDefault();
				$('table').hide();

				//clear existing table field values
				$('#result').text(null);
				$('#result').append('<tr><th>Tag</th><th>Field</th><TH>Value</TH></tr>');
				$('#error').text(null);

				var input = $('#userString').val(),
					inputClean = input.slice(input.indexOf('<FIXML'), input.indexOf('</FIXML>') + 8), //Clean the input in case of unthoughtful user adding noise
					fixmlObject = FixmlToOBJ(inputClean);


				//error check
				if(fixmlObject.err != 'none'){ 
					$('#error').text(fixmlObject.err);
					$('#result').text(null);
				}

				//build the table
				for(var field in fixmlObject){
					console.log(field);
					if(fixmlObject[field].description != null && fixmlObject[field].description != 'Exchange'){
						$('#result').append('<TR>'+'<TD>' + field +'</TD>' +'<TD id="'+ fixmlObject[field].description +'">' + fixmlObject[field].description + '</TD>' + '<TD id="'+ fixmlObject[field].value +'">' + fixmlObject[field].value + '</TD></TR>' );
					}

					//Look up exchange and hyperlink to it in the table
					if(fixmlObject[field].description == 'Exchange'){
						var exchInfo = exchange(fixmlObject[field].value);
						$('#result').append('<TR>' + '<TD>' + field +'</TD>' + '<TD id="'+ fixmlObject[field].description +'">' + fixmlObject[field].description + '</a></TD>' + '<TD id="'+ fixmlObject[field].value +'"><a href="'+ exchInfo.website +'" target="_blank">' + exchInfo.name + '</a></TD></TR>' );
					}
				}

				$('table').show();
			});
		});


		//==PROCESS SIDE==
		//take in full fixml msg as single string and return it as a Object
		function FixmlToOBJ(fixmlString){
			var msg = {};
			
			//What kind of fixml message is it?
			msg.Type = fixmlString.slice(fixmlString.indexOf('<',1) +1 ,fixmlString.indexOf(' ', (fixmlString.indexOf('<',1) - 1)));

			if (msg.Type === 'TrdCaptRpt'){
				msg.err = 'none';
				msg.RptID = define( msg.Type,'RptID' , extract(fixmlString, 'RptID'));
				msg.CopyMsgInd = define( msg.Type, 'CopyMsgInd', extract(fixmlString, 'CopyMsgInd'));
				msg.TrdRptStat = define( msg.Type, 'TrdRptStat', extract(fixmlString, 'TrdRptStat'));
				msg.TrdID = define( msg.Type, 'TrdID', extract(fixmlString, 'TrdID'));
				msg.LastPx = define( msg.Type, 'LastPx', extract(fixmlString, 'LastPx'));
				msg.Side= define(msg.Type, 'Side' , extract(fixmlString, ' Side'));
				msg.LastQty = define( msg.Type, 'LastQty', extract(fixmlString, 'LastQty'));
				msg.TrdDt = define( msg.Type, 'TrdDt', extract(fixmlString, 'TrdDt'));
				msg.BizDt = define( msg.Type, 'BizDt', extract(fixmlString, 'BizDt'));
				msg.TxnTm = define( msg.Type, 'TxnTm', extract(fixmlString, 'TxnTm'));
				msg.TrdTyp = define( msg.Type, 'TrdTyp', extract(fixmlString, 'TrdTyp'));
				msg.MtchStat = define( msg.Type, 'MtchStat', extract(fixmlString, 'MtchStat'));
				msg.VenuTyp = define( msg.Type, 'VenuTyp', extract(fixmlString, 'VenuTyp'));
				msg.ExecID = define( msg.Type, 'ExecID', extract(fixmlString, 'ExecID'));
				msg.TrdPubInd = define( msg.Type, 'TrdPubInd', extract(fixmlString, 'TrdPubInd'));
				msg.RptTyp = define( msg.Type, 'RptTyp', extract(fixmlString, 'RptTyp'));
				msg.TransTyp = define( msg.Type, 'TransTyp', extract(fixmlString, 'TransTyp'));
				msg.OrdTyp = define( msg.Type, 'OrdTyp', extract(fixmlString, 'OrdTyp'));
				//Header
				msg.Snt = define( msg.Type, 'Snt', extract(fixmlString, 'Snt'));
				msg.SID = define( msg.Type, 'SID', extract(fixmlString, 'SID'));
				msg.TID = define( msg.Type, 'TID', extract(fixmlString, 'TID'));
				//Instrument
				msg.SecTyp = define( msg.Type, 'SecTyp', extract(fixmlString, 'SecTyp'));
				msg.MMY = define( msg.Type, 'MMY', extract(fixmlString, 'MMY'));
				msg.Exch = define( msg.Type, 'Exch', extract(fixmlString, 'Exch'));
				//Report Side
				msg.OrdID = define( msg.Type, 'OrdID', extract(fixmlString, ' OrdID'));
				msg.CustCpcty = define( msg.Type,'CustCpcty' , extract(fixmlString, 'CustCpcty'));
				msg.ClOrdID = define( msg.Type,'ClOrdID' , extract(fixmlString, 'ClOrdID'));
				msg.ClOrdID2 = define( msg.Type, 'ClOrdID2', extract(fixmlString, 'ClOrdID2'));
				msg.AgrsrInd = define( msg.Type, 'AgrsrInd', extract(fixmlString, 'AgrsrInd'));
				msg.InptSrc = define( msg.Type,'InptSrc' , extract(fixmlString, 'InptSrc'));
				msg.InptDev = define( msg.Type, 'InptDev', extract(fixmlString, 'InptDev'));
			} else if (msg.Type === 'AllocInstrctnAlert'){
				msg.err = 'none';
				msg.Stat= define(msg.Type,'Stat', extract(fixmlString, 'Stat'));
				msg.TxnTm= define(msg.Type,'TxnTm', extract(fixmlString, 'TxnTm'));
				msg.SesSub= define(msg.Type,'SesSub', extract(fixmlString, 'SesSub'));
				msg.InptSrc= define(msg.Type,'InptSrc', extract(fixmlString, 'InptSrc'));
				msg.AvgPx= define(msg.Type,'AvgPx', extract(fixmlString, 'AvgPx'));
				msg.RndPx= define(msg.Type,'RndPx', extract(fixmlString, 'RndPx'));
				msg.AvgPxInd= define(msg.Type,'AvgPxInd', extract(fixmlString, 'AvgPxInd'));
				msg.BizDt= define(msg.Type,'BizDt', extract(fixmlString, 'BizDt'));
				msg.CustCpcty= define(msg.Type,'CustCpcty', extract(fixmlString, 'CustCpcty'));
				msg.AvgPxGrpID= define(msg.Type,'AvgPxGrpID', extract(fixmlString, 'AvgPxGrpID'));
				msg.GrpID= define(msg.Type,'GrpID', extract(fixmlString, ' GrpID')); //extra space to not confuse with AvgPxGrpID
				msg.GrpQty= define(msg.Type,'GrpQty', extract(fixmlString, 'GrpQty'));
				msg.RemQty= define(msg.Type,'RemQty', extract(fixmlString, 'RemQty'));
				msg.Side= define(msg.Type,'Side', extract(fixmlString, ' Side')) ;
				msg.TrdDt= define(msg.Type,'TrdDt', extract(fixmlString, 'TrdDt'));
				msg.TrdTyp= define(msg.Type,'TrdTyp', extract(fixmlString, 'TrdTyp'));
				msg.Qty= define(msg.Type,'Qty', extract(fixmlString, 'Qty')) ;
				msg.Typ= define(msg.Type,'Typ', extract(fixmlString, ' Typ')) ; //extra space so no to confuse with TrdTyp
				msg.TransTyp= define(msg.Type,'TransTyp', extract(fixmlString, 'TransTyp'));
				//HEADER
				msg.Snt= define(msg.Type,'Snt', extract(fixmlString, 'Snt'));
				msg.SID= define(msg.Type,'SID', extract(fixmlString, 'SID'));
				msg.TID= define(msg.Type,'TID', extract(fixmlString, 'TID'));
				//ALL EXC
				msg.LastQty= define(msg.Type,'LastQty', extract(fixmlString, 'LastQty'));
				msg.TrdID= define(msg.Type,'TrdID', extract(fixmlString, 'TrdID'));
				//INSTRUMENT
				msg.Exch= define(msg.Type,'Exch', extract(fixmlString, 'Exch'));
				msg.MMY= define(msg.Type,'MMY', extract(fixmlString, 'MMY'));
				msg.SecTyp= define(msg.Type,'SecTyp', extract(fixmlString, 'SecTyp'));
			} else if (msg.Type === 'AllocRpt'){
				msg.err = 'none';
				msg.RptID= define(msg.Type, 'RptID' , extract(fixmlString, 'RptID'));
				msg.Stat= define(msg.Type, 'Stat' , extract(fixmlString, 'Stat'));
				msg.RptTyp= define(msg.Type, 'RptTyp' , extract(fixmlString, 'RptTyp'));
				msg.TrdSubTyp= define(msg.Type, 'TrdSubTyp' , extract(fixmlString, 'TrdSubTyp'));
				msg.SesSub= define(msg.Type, 'SesSub' , extract(fixmlString, 'SesSub'));
				msg.TransTyp= define(msg.Type, 'TransTyp' , extract(fixmlString, 'TransTyp'));
				msg.Qty= define(msg.Type, 'Qty' , extract(fixmlString, 'Qty')); 
				msg.InptSrc= define(msg.Type, 'InptSrc' , extract(fixmlString, 'InptSrc'));
				msg.InptDev= define(msg.Type, 'InptDev' , extract(fixmlString, 'InptDev'));
				msg.Side= define(msg.Type, 'Side' , extract(fixmlString, ' Side')); 
				msg.CustCpcty= define(msg.Type, 'CustCpcty' , extract(fixmlString, 'CustCpcty'));
				msg.TrdTyp= define(msg.Type, 'TrdTyp' , extract(fixmlString, 'TrdTyp'));
				msg.TrdDt= define(msg.Type, 'TrdDt' , extract(fixmlString, 'TrdDt'));
				msg.BizDt= define(msg.Type, 'BizDt' , extract(fixmlString, 'BizDt'));
				msg.AvgPx= define(msg.Type, 'AvgPx' , extract(fixmlString, 'AvgPx'));
				msg.PosEfct= define(msg.Type, 'PosEfct' , extract(fixmlString, 'PosEfct'));
				msg.TrdPubInd= define(msg.Type, 'TrdPubInd' , extract(fixmlString, 'TrdPubInd'));
				msg.TxnTm= define(msg.Type, 'TxnTm' , extract(fixmlString, 'TxnTm'));
				msg.MLegRptTyp = define(msg.Type, 'MLegRptTyp', extract(fixmlString, 'MLegRptTyp'));
				//HEADER 
				msg.SID= define(msg.Type, 'SID' , extract(fixmlString, 'SID'));
				msg.TID= define(msg.Type, 'TID' , extract(fixmlString, 'TID'));
				msg.Snt= define(msg.Type, 'Snt' , extract(fixmlString, 'Snt'));
				msg.ClOrdID= define(msg.Type, 'ClOrdID' , extract(fixmlString, 'ClOrdID'));
				//INSTRUMENT
				msg.ID= define(msg.Type, 'ID' , extract(fixmlString, ' ID')); //instrument ID. Extra space to not confuse with ClordID or RptID
				msg.MMY= define(msg.Type, 'MMY' , extract(fixmlString, 'MMY'));
				msg.Exch= define(msg.Type, 'Exch' , extract(fixmlString, 'Exch'));
				msg.PutCall= define(msg.Type, 'PutCall' , extract(fixmlString, 'PutCall'));
				msg.StrkPx= define(msg.Type, 'StrkPx' , extract(fixmlString, 'StrkPx'));
				msg.SecTyp= define(msg.Type, 'SecTyp' , extract(fixmlString, 'SecTyp'));
				msg.CFU= define(msg.Type, 'CFI' , extract(fixmlString, 'CFI'));
				//ALLOCATION
				msg.IndAllocID2= define(msg.Type, 'IndAllocID2' , extract(fixmlString, 'IndAllocID2'));
				msg.AllocPosEfct= define(msg.Type, 'AllocPosEfct' , extract(fixmlString, 'AllocPosEfct'));
			} else {
				msg.err = 'Error: ['+ msg.Type +'] message types are not included yet, or message not pasted completely.'; //error handling for unsupported msg type
			}

			return msg;
		}

		//input of fixml string and field to be extracted, out goes field value
		function extract (fixmlString, field) {
			if( fixmlString.indexOf(field) == -1 ){
				return field + " not found"; //error check
			} else{
				field = field + "=";
				var beginning = fixmlString.indexOf(field) + field.length + 1;
				var ending = fixmlString.indexOf('"', beginning + 1 );
				return fixmlString.slice(beginning,ending);
			}
		}

		//input type of report, field looking for, and field value, return OBJECT of description, and the entry value
		function define (reportType, field, entry) {

			// provide plain english descriptions
			var TrdCaptRpt = {
				RptID: {summary: "Report ID" , parm: false},
				CopyMsgInd: {summary: "Copy of Another Message" , parm: true, Y: "Yes", N: "No"},
				TrdRptStat: {summary: "Report Status" , parm: true, 0:"Accepted", 1:"Rejected", 2:"Accepted with errors"},
				Side:{summary: "Side of Order", parm:true, 1: "Buy", 2: "Sell", 3: "Buy minus", 4: "Sell plus", 5: "Sell short", 6: "Sell short exempt", 7: "Undisclosed ", 8: "Cross", 9: "Cross short", A: "Cross short exempt", B: "As Defined", C: "Opposite", D: "Subscribe", E: "Redeem", F: "Lend", G: "Borrow"}, 
				TrdID: {summary: "Trade ID" , parm: false},
				LastPx: {summary: "Price" , parm: false},
				LastQty: {summary: "Quantity" , parm: false},
				TrdDt: {summary: "Original Trade Date" , parm: false},
				BizDt: {summary: "Clearing Date" , parm: false},
				TxnTm: {summary: "Time" , parm: false},
				TrdTyp: {summary: "Trade Type", parm: true, 0: "Regular Trade",1: "Block Trade",2: "Exchange for physical (EFP)",3: "Transfer",4: "Late Trade",5: "T Trade",6: "Weighted Average Price Trade",7: "Bunched Trade",8: "Late Bunched Trade",9: "Prior Reference Price Trade",10: "After Hours Trade",11: "Exchange for Risk (EFR)",12: "Exchange for Swap (EFS )",13: "Exchange of Futures for in Market Futures (EFM)",14: "Exchange of Options for Options (EOO)",15: "Trading at Settlement",16: "All or None",17: "Futures Large Order Execution",18: "Exchange of Futures for Futures (EFF)",19: "Option Interim Trade",20: "Option Cabinet Trade",22: "Privately Negotiated Trades",23: "Substitution of Futures for Forwards",48: "Non-standard settlement",49: "Derivative Related Transaction",50: "Portfolio Trade",51: "Volume Weighted Average Trade",52: "Exchange Granted Trade",53: "Repurchase Agreement",54: "OTC",55: "Exchange Basis Facility (EBF)",24: "Error trade",25: "Special cum dividend (CD)",26: "Special ex dividend (XD)",27: "Special cum coupon (CC)",28: "Special ex coupon (XC)",29: "Cash settlement (CS)",30: "Special price (net or all-in) (SP)",31: "Guaranteed delivery (GD)",32: "Special cum rights (CR)",33: "Special ex rights (XR)",34: "Special cum capital repayments (CP)",35: "Special ex capital repayments (XP)",36: "Special cum bonus (CB)",37: "Special ex bonus (XB)",38: "Block trade",39: "Worked principal trade (UK-specific)",40: "Block Trades - after market",41: "Name change",42: "Portfolio transfer",43: "Prorogation buy - Euronext Paris only",44: "Prorogation sell - Euronext Paris only",45: "Option exercise",46: "Delta neutral transaction",47: "Financing transaction (includes repo and stock lending)", 58: "Swap Block"},
				MtchStat: {summary: "Match Status", parm: true, 0:"Compaired", 1:"Not Compaired", 2: "Advisory or Alert" },
				OrdTyp: {summary: "Order Type (CME)", parm: true, 1: "Market", 2: "Limit", 3: "Stop", 4: "Stop limit", 5: "Market on close", 6: "With or without", 7: "Limit or better", 8: "Limit with or without", 9: "On basis", A: "On close", B: "Limit on close", C: "Forex - Market", D: "Previously quoted", E: "Previously indicated", F: "Forex - Limit", G: "Forex - Swap", H: "Forex - Previously Quoted", I: "Funari (Limit Day Order with unexecuted portion)", J: "Market if touched",K: "Market with Left Over As Limit",L: "Previous Fund Valuation Point",M: "Next Fund Valuation Point",P: "Pegged", Q: "Counter order selection",R: "Stop on Bid or Offer",S: "Stop limit on bid or offer"},
				VenuTyp: {summary: "Venue Where Executed", parm: true, E:"Electronic",P:"Pit",X:"Ex-Pit"},
				ExecID: {summary: "Execution ID", parm: false},
				TrdPubInd: {summary: "Publish for Market Reporting", parm: true, 0:"Don't Publish", 1:"Publish", 2:"Publishing deffered"},
				RptTyp: {summary: "Trade Report Type", parm: true, 0: "Submit",1: "Alleged",2: "Accept",3: "Decline",4: "Addendum",5: "No/Was",6: "Trade Report Cancel",7: "(Locked-In) Trade Break",8: "Defaulted",9: "Invalid CMTA",10: "Pended",11: "Alleged New",12: "Alleged Addendum",13: "Alleged No/Was",14: "Alleged Trade Report Cancel",15: "Alleged (Locked-In) Trade Break"},
				TransTyp: {summary: "Transaction Type", parm:true, 0:"New",1:"Cancel",2:"Replace",3:"Release",4:"Reverse",5:"Cancel - Back Out Of Trade"},
				SecTyp: {summary: "Security Type", parm: true, FUT:"Future", OOF:"Option on Future"},
				Snt: {summary: "Snt", parm:false},
				SID: {summary: "SID", parm:false},
				TID: {summary: "TID", parm:false},
				MMY: {summary:"Contract Period (year & month)", parm: false},
				Exch: {summary:"Exchange", parm:false},
				InptSrc: {summary:"Input Source", parm:false},
				InptDev: {summary:"Input Device", parm:false},
				OrdID: {summary: "OrdID", parm:false},
				CustCpcty:{summary: "Customer Capacity Type", parm:true, 1:"Member trading for own account", 2:"Clearing firm trading proprietary account", 3:"Member trading for another member", 4:"other"},
				AvgPxGrpID:{summary: "Average Price Group ID", parm:false},
				ClOrdID: {summary: "Order ID Assigned Buy-Side (ClOrdID)", parm:false},
				ClOrdID2: {summary: "ClOrdID2", parm:false},
				AgrsrInd: {summary: "Is Order Initiator Aggressor", parm:true, Y:"Yes - initiator is aggressor", N:"No - initiator is passive"}
			};

			var AllocInstrctnAlert = {
				Stat:{summary: "Allocation Status", parm:true, 0:"Accepted", 1:"Block level reject", 2:"account level reject", 3:"Recieved but not processed", 4:"incomplete",5:"rejected by intermediary", 6:"Pending allocation", 7:"reversed", 9:"Claimed"},
				TxnTm:{summary: "Transaction Time", parm:false},
				SesSub:{summary: "Venue Where Executed", parm: true, E:"Electronic",P:"Pit",X:"Ex-Pit"}, //sesssub same as venutype, exch thing, not proper fixml protocol
				InptSrc: {summary:"Input Source", parm:false},
				AvgPx:{summary: "Average Price", parm:false},
				RndPx:{summary: "Rounded Price", parm:false},
				AvgPxInd:{summary: "Average Price Indicator", parm:true, 0:"No average price", 1:"Trade is part of an average price group", 2:"Last trade is the average price group"},
				BizDt: {summary: "Clearing Date" , parm: false},
				CustCpcty:{summary: "Customer Capacity Type", parm:true, 1:"Member trading for own account", 2:"Clearing firm trading proprietary account", 3:"Member trading for another member", 4:"other"},
				AvgPxGrpID:{summary: "Average Price Group ID", parm:false},
				GrpID:{summary: "Group ID", parm:false},
				GrpQty:{summary: "Group Quantity", parm:false},
				RemQty:{summary: "Rem Quantity", parm:false},
				Side:{summary: "Side of order", parm:true, 1: "Buy", 2: "Sell", 3: "Buy minus", 4: "Sell plus", 5: "Sell short", 6: "Sell short exempt", 7: "Undisclosed ", 8: "Cross", 9: "Cross short", A: "Cross short exempt", B: "As Defined", C: "Opposite", D: "Subscribe", E: "Redeem", F: "Lend", G: "Borrow"}, 
				TrdDt:{summary: "Trade Date", parm:false},
				TrdTyp: {summary: "Trade Type", parm: true, 0: "Regular Trade",1: "Block Trade",2: "Exchange for physical (EFP)",3: "Transfer",4: "Late Trade",5: "T Trade",6: "Weighted Average Price Trade",7: "Bunched Trade",8: "Late Bunched Trade",9: "Prior Reference Price Trade",10: "After Hours Trade",11: "Exchange for Risk (EFR)",12: "Exchange for Swap (EFS )",13: "Exchange of Futures for in Market Futures (EFM)",14: "Exchange of Options for Options (EOO)",15: "Trading at Settlement",16: "All or None",17: "Futures Large Order Execution",18: "Exchange of Futures for Futures (EFF)",19: "Option Interim Trade",20: "Option Cabinet Trade",22: "Privately Negotiated Trades",23: "Substitution of Futures for Forwards",48: "Non-standard settlement",49: "Derivative Related Transaction",50: "Portfolio Trade",51: "Volume Weighted Average Trade",52: "Exchange Granted Trade",53: "Repurchase Agreement",54: "OTC",55: "Exchange Basis Facility (EBF)",24: "Error trade",25: "Special cum dividend (CD)",26: "Special ex dividend (XD)",27: "Special cum coupon (CC)",28: "Special ex coupon (XC)",29: "Cash settlement (CS)",30: "Special price (net or all-in) (SP)",31: "Guaranteed delivery (GD)",32: "Special cum rights (CR)",33: "Special ex rights (XR)",34: "Special cum capital repayments (CP)",35: "Special ex capital repayments (XP)",36: "Special cum bonus (CB)",37: "Special ex bonus (XB)",38: "Block trade",39: "Worked principal trade (UK-specific)",40: "Block Trades - after market",41: "Name change",42: "Portfolio transfer",43: "Prorogation buy - Euronext Paris only",44: "Prorogation sell - Euronext Paris only",45: "Option exercise",46: "Delta neutral transaction",47: "Financing transaction (includes repo and stock lending)", 58: "Swap Block"},
				Qty:{summary: "Quantity", parm:false}, 
				Typ:{summary: "Specific Allocation Type", parm:true, 1: "Calculated", 2: "Preliminary", 3: "Sellside Calculated Using Preliminary", 4: "Sellside Calculated Without Preliminary", 5: "Ready-To-Book - Single Order", 6: "Buyside Ready-To-Book - Combined Set of Orders", 7: "Warehouse Instruction", 8: "Request to Intermediary", 9: "Accept", 10: "Reject", 11: "Accept Pending", 12: "Incomplete Group", 13: "Complete Group", 14: "Reversal Pending"}, 
				TransTyp:{summary: "Allocation Transaction Type", parm:true, 0:"New", 1:"Replace", 2:"Cancel", 3:"Preliminary", 4:"Calculated", 5:"Calculated without preliminary", 6:"Reversal"},
				VenuTyp: {summary: "Venue Where Executed", parm: true, E:"Electronic",P:"Pit",X:"Ex-Pit"},
				//HEADER
				Snt:{summary: "Date and Time Sent", parm:false},
				SID:{summary: "SID", parm:false},
				TID:{summary: "TID", parm:false},
				//ALL EXC
				LastQty:{summary: "Last Quantity", parm:false},
				TrdID:{summary: "Trade ID", parm:false},
				//INSTRUMENT
				Exch:{summary: "Exchange", parm:false},
				MMY:{summary: "Contract Period (year & month)", parm:false},
				SecTyp: {summary: "Security Type", parm: true, FUT:"Future", OOF:"Option on Future"}
			};

			var AllocRpt = {
				RptID: {summary: "Allocation Report ID", parm:false},
				Stat: {summary: "Allocation Status", parm:true, 0:"Accepted", 1:"Block level reject", 2:"account level reject", 3:"Recieved but not processed", 4:"incomplete",5:"rejected by intermediary", 6:"Pending allocation", 7:"reversed", 9:"Claimed"}, 
				RptTyp: {summary: "Allocation Report Type/Purpose", parm:true, 2:"Preliminary request to intermediary", 3:"Sellside using preliminary", 4:"Sellside without preliminary", 5:"Warehouse recap", 8:"Request to intermediary", 9:"Accept", 10:"Reject", 11:"Accept pending", 12:"Complete", 14:"Reverse pending", 15:"Give-up", 16:"Take-up", 17:"Reversal", 18:"Alleged reversal", 19:"Sub allocation Give-up"}, 
				TrdSubTyp: {summary: "Trade Subtype", parm:true, 0: "CMTA", 1: "Internal transfer or adjustment", 2: "External transfer or transfer of account", 3: "Reject for submitting side", 4: "Advisory for contra side", 5: "Offset due to an allocation", 6: "Onset due to an allocation", 7: "Differential spread", 8: "Implied spread leg executed against an outright", 9: "Transaction from exercise", 10: "Transaction from assignment", 11: "ACATS", 33: "Off Hours Trade", 34: "On Hours Trade", 35: "OTC Quote", 36: "Converted SWAP", 14: "AI (Automated input facility disabled in response to an exchange request.)", 15: "B (where neither member firm is registered as a market maker)", 16: "K (using block trade facility.)", 17: "LC (Correction submitted more than three days after publication)", 18: "M (Transaction, other than a transaction resulting from a stock swap or stock switch)", 19: "N (Non-protected portfolio transaction or a fully disclosed portfolio transaction)", 20: "NM (Exchange has granted permission for non-publication)", 21: "NR (Non-risk SEATS security other than an AIM security)", 22: "P (Protected portfolio transaction)", 23: "PA (Protected transaction notification)", 24: "PC (Contra trade on a previous day and which was automatically executed on the Exchange trading system)", 25: "PN (Worked portfolio transaction which includes order book securities)", 26: "R (riskless principal transaction)", 27: "RO (resulted from the exercise of a option or a stock-settled covered warrant)", 28: "RT (Risk transaction in a SEATS security, (excluding AIM security))", 29: "SW (Transactions resulting from stock swap or a stock switch)", 30: "T (If reporting a single protected transaction)", 31: "WN (Worked principal notification for a single order book security)", 32: "WT (Worked principal transaction (other than a portfolio transaction))", 37: "Crossed Trade (X)", 38: "Interim Protected Trade (I)", 39: "Large in Scale (L)", 40: "Traded at settlement (TAS)"},
				SesSub: {summary: "Venue Where Executed", parm: true, E:"Electronic",P:"Pit",X:"Ex-Pit"}, //sesssub same as venutype, exch thing, not proper fixml protocol
				TransTyp: {summary: "Allocation Transaction Type", parm:true, 0:"New", 1:"Replace", 2:"Cancel", 3:"Preliminary", 4:"Calculated", 5:"Calculated without preliminary", 6:"Reversal"}, 
				Qty: {summary: "Quantity", parm:false},
				MLegRptTyp: {summary: "Leg Report Type", parm:true, 1:"Single security", 2:"Individual leg of multi-leg", 3:"multi-leg"},
				InptSrc: {summary: "Input Source", parm:false},
				InptDev: {summary: "Input Device", parm:false},
				Side: {summary: "Side of Order", parm:true, 1: "Buy", 2: "Sell", 3: "Buy minus", 4: "Sell plus", 5: "Sell short", 6: "Sell short exempt", 7: "Undisclosed ", 8: "Cross", 9: "Cross short", A: "Cross short exempt", B: "As Defined", C: "Opposite", D: "Subscribe", E: "Redeem", F: "Lend", G: "Borrow"},
				CustCpcty: {summary: "Customer Capacity Type (regulatory)", parm:true, 1:"Member trading for own account", 2:"Clearing firm trading proprietary account", 3:"Member trading for another member", 4:"other"}, 
				TrdTyp: {summary: "Trade Type", parm: true, 0: "Regular Trade",1: "Block Trade",2: "Exchange for physical (EFP)",3: "Transfer",4: "Late Trade",5: "T Trade",6: "Weighted Average Price Trade",7: "Bunched Trade",8: "Late Bunched Trade",9: "Prior Reference Price Trade",10: "After Hours Trade",11: "Exchange for Risk (EFR)",12: "Exchange for Swap (EFS )",13: "Exchange of Futures for in Market Futures (EFM)",14: "Exchange of Options for Options (EOO)",15: "Trading at Settlement",16: "All or None",17: "Futures Large Order Execution",18: "Exchange of Futures for Futures (EFF)",19: "Option Interim Trade",20: "Option Cabinet Trade",22: "Privately Negotiated Trades",23: "Substitution of Futures for Forwards",48: "Non-standard settlement",49: "Derivative Related Transaction",50: "Portfolio Trade",51: "Volume Weighted Average Trade",52: "Exchange Granted Trade",53: "Repurchase Agreement",54: "OTC",55: "Exchange Basis Facility (EBF)",24: "Error trade",25: "Special cum dividend (CD)",26: "Special ex dividend (XD)",27: "Special cum coupon (CC)",28: "Special ex coupon (XC)",29: "Cash settlement (CS)",30: "Special price (net or all-in) (SP)",31: "Guaranteed delivery (GD)",32: "Special cum rights (CR)",33: "Special ex rights (XR)",34: "Special cum capital repayments (CP)",35: "Special ex capital repayments (XP)",36: "Special cum bonus (CB)",37: "Special ex bonus (XB)",38: "Block trade",39: "Worked principal trade (UK-specific)",40: "Block Trades - after market",41: "Name change",42: "Portfolio transfer",43: "Prorogation buy - Euronext Paris only",44: "Prorogation sell - Euronext Paris only",45: "Option exercise",46: "Delta neutral transaction",47: "Financing transaction (includes repo and stock lending)", 58: "Swap Block"}, 
				TrdDt: {summary: "Trade Date", parm:false}, 
				BizDt: {summary: "Clearing Date", parm:false}, 
				AvgPx: {summary: "Average Price", parm:false}, 
				PosEfct: {summary: "Position Effect (omnibus accounting)", parm:true, C:"Close", F:"FIFO", O:"Open", R:"Rolled", N:"Close but notify", D:"Default"}, 
				TrdPubInd: {summary: "Publish Indicator", parm:true, 0:"Don't publish trade", 1:"Publish trade", 2:"Deferred publication"}, 
				TxnTm: {summary: "Transaction Time", parm:false}, 
				VenuTyp: {summary: "Venue Where Executed", parm: true, E:"Electronic",P:"Pit",X:"Ex-Pit"},
				//HEADER 
				Snt:{summary: "Date and Time Sent", parm:false},
				SID:{summary: "SID", parm:false},
				TID:{summary: "TID", parm:false},
				ClOrdID: {summary: "Order ID Assigned Buy-Side (ClOrdID)", parm:false}, 
				//INSTRUMENT
				ID: {summary: "Instrument ID", parm:false},  //instrument ID.
				MMY: {summary: "Contract Period (year & month)", parm:false}, 
				Exch: {summary: "Exchange", parm:false}, 
				PutCall: {summary: "Put or Call", parm:false}, 
				StrkPx: {summary: "Strike Price", parm:false}, 
				SecTyp: {summary: "Security Type", parm: true, FUT:"Future", OOF:"Option on Future"},
				CFI: {summary: "Classification of Financial Instruments", parm: false},
				//ALLOCATION
				IndAllocID2: {summary: "IndAllocID2", parm:false}, 
				AllocPosEfct: {summary: "AllocPosEfct", parm:false}
			};

			if (reportType === 'TrdCaptRpt') {
				var summary = TrdCaptRpt[field].summary;
				var check = TrdCaptRpt[field].parm;
				var replyValue = TrdCaptRpt[field][entry];
			} else if (reportType === 'AllocInstrctnAlert') {
				var summary = AllocInstrctnAlert[field].summary;
				var check = AllocInstrctnAlert[field].parm;
				var replyValue = AllocInstrctnAlert[field][entry];
			} else if (reportType === 'AllocRpt') {
				var summary = AllocRpt[field].summary;
				var check = AllocRpt[field].parm;
				var replyValue = AllocRpt[field][entry];
			}	

			//IF parms are not available
			if ( check === false) {
				var reply = {description: summary, value: entry};
				return reply;
			}

			//IF parms are available
			if (check === true) {
				var a = field + ' not found'; //to display not found message UI side
				if(entry != a){
					var reply = {description: summary, value: replyValue};
				} else {
					var reply = {description: summary, value: entry}; //to display not found message UI side
				}
				return reply;
			}
		}

		//Input market code or acronym, return object with full name and website
		function exchange (market){

			var marketCode = {
				CME: {name:'Chicago Merchantile Exchange', website:'http://www.cmegroup.com/'},
				CMECE: {name:'CME Clearing Europe', website:'http://www.cmegroup.com/europe/clearing-europe/'},
				CBOT: {name:'Chicago Board of Trade', website:'http://www.cmegroup.com/company/cbot.html'},
				CBT: {name:'Chicago Board of Trade', website:'http://www.cmegroup.com/company/cbot.html'},
				NYMEX: {name:'New York Mercantile Exchange', website:'http://www.cmegroup.com/company/nymex.html'},
				COMEX: {name:'Commodity Exchange', website:'http://www.cmegroup.com/company/comex.html'},
				CFE: {name:'CBOE Futures Exchange (OCC)', website:'http://cfe.cboe.com/'},
				XCBF: {name:'CBOE Futures Exchange (Cleared by OCC)', website:'http://cfe.cboe.com/'},
				ICE: {name:'Intercontinental Exchange', website:'https://www.theice.com/index'},
				IFUS: {name:'ICE Futures U.S', website:'https://www.theice.com/futures-us'},
				IFEU: {name:'ICE Futures Europe', website:'https://www.theice.com/futures-europe'},
				OCC: {name:'Options Clearing Corporation', website:'http://www.optionsclearing.com/'},
				ELX: {name:'ELX (OCC)', website:'http://www.elxmarkets.com/'},
				XELX: {name:'ELX (OCC)', website:'http://www.elxmarkets.com/'},
				EUREX: {name:'Eurex Exchange', website:'http://www.eurexchange.com/exchange-en/'},
				LME: {name:'London Metal Exchange', website:'https://www.lme.com/'},
				SGX: {name:'Singapore Exchange', website:'http://www.sgx.com/'},
				IMM:{name:'International Monetary Market (CME)', website:'http://www.cmegroup.com/'},
				KCBT: {name:'Kansas City Board of Trade (CME)', website:'http://www.cmegroup.com/trading/agricultural/'},
				MGEX: {name:'Minneapolis Grain Exchange', website:'http://www.mgex.com/'},
				MGE: {name:'Minneapolis Grain Exchange', website:'http://www.mgex.com/'},
				CCE: {name:'Chicago Climate Exchange (ICE)', website:'https://www.theice.com/ccx'},
				MX: {name:'Montreal Exchange (TMX)', website:'https://www.m-x.ca/accueil_en.php'},
				BDM: {name:'Bourse de MontrÃ©al (Montreal Exchange / TMX)', website:'https://www.m-x.ca/accueil_en.php'},
				TMX: {name:'TMX (Montreal Exchange / TMX)', website:'https://www.tmx.com/'},
				CDCC: {name:'Canadian Derivatives Clearing Corporation (Montreal Exchange)', website:'http://www.cdcc.ca/index_en'},
				Nadex: {name:'Northern American Derivatives Exchange (HedgeStreet)', website:'http://www.nadex.com/'},
				LIFFE: {name:'ICE Futures Europe (London International Financial Futures and Options Exchange)', website:'https://www.theice.com/futures-europe'},
				MEFF: {name:'Mercado EspaÃ±ol de Futuros Financieros', website:'http://www.meff.es/'},
				OMX: {name:'NASDAQ OMX', website:'http://business.nasdaq.com/'},
				DME: {name:'Dubai Mercantile Exchange', website:'http://www.dubaimerc.com/'},
				KRX: {name:'Korea Exchange', website:'http://www.krx.co.kr/'},
				NSE: {name: 'National Stock Exchange of India', website:'http://www.nseindia.com/'},
				BSE: {name: 'Bombay Stock Exchange', website:'http://www.bseindia.com/'},
				IEX: {name: 'Indian Energy Exchange', website:'http://www.iexindia.com/'},
				HKEX: {name: 'Hong Kong Exchange', website:'https://www.hkex.com.hk/eng/index.htm'},
				SHFE: {name: 'Shanghai Futures Exchange', website:'http://www.shfe.com.cn/en/'},
				ZCE: {name: 'Zhengzhou Commodity Exchange', website:'english.czce.com.cn'},
				SAFEX: {name: 'South African Futures Exchange', website:'www.safex.co.za'},
				MEXDER: {name: 'Mexican Derivatives Exchange', website:'http://www.cmegroup.com/international/partnership-resources/mexder-resources.html'},
				BVMF: {name: 'Bolsa de Valores, Mercadorias & Futuros de SÃ£o Paulo', website:'http://www.bmfbovespa.com.br/en-us/home.aspx?idioma=en-us'},
				OMIP: {name: 'Iberian Energy Clearing House', website:'http://www.omiclear.pt/OMIClear/tabid/130/language/en-GB/Default.aspx'},
				error: {name: market + ' (unknown exchange)', website: 'http://www.iotafinance.com/en/ISO-10383-Market-Identification-Codes-MIC.html'} //error handling
			};

			if (marketCode[market.toUpperCase()] != null){
				return marketCode[market.toUpperCase()];
			} else {
				return marketCode.error; //error handling
			}
		}