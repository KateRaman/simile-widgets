﻿

/* compile-prolog.js */
window.Exhibit_CurateExtension_isCompiled=true;


/* curate-extension.js */
(function(){var F=("Exhibit_CurateExtension_isCompiled" in window)&&window.Exhibit_CurateExtension_isCompiled;
Exhibit.CurateExtension={params:{bundle:false}};
var G=["change-list.js","item-creator.js","scraper.js","submission-backend.js","submission-widgets.js"];
var B=["change-list.css","scraper.css"];
var E={bundle:Boolean};
if(typeof Exhibit_CurateExtension_urlPrefix=="string"){Exhibit.CurateExtension.urlPrefix=Exhibit_CurateExtension_urlPrefix;
if("Exhibit_CurateExtension_parameters" in window){SimileAjax.parseURLParameters(Exhibit_CurateExtension_parameters,Exhibit.CurateExtension.params,E);
}}else{var D=SimileAjax.findScript(document,"/curate-extension.js");
if(D==null){SimileAjax.Debug.exception(new Error("Failed to derive URL prefix for Simile Exhibit Curate Extension code files"));
return ;
}Exhibit.CurateExtension.urlPrefix=D.substr(0,D.indexOf("curate-extension.js"));
SimileAjax.parseURLParameters(D,Exhibit.CurateExtension.params,E);
}var A=[];
var C=[];
SimileAjax.prefixURLs(A,Exhibit.CurateExtension.urlPrefix+"scripts/",G);
SimileAjax.prefixURLs(C,Exhibit.CurateExtension.urlPrefix+"styles/",B);
if(!F){SimileAjax.includeJavascriptFiles(document,"",A);
SimileAjax.includeCssFiles(document,"",C);
}})();


/* curate-extension-bundle.js */
Exhibit.ChangeList=function(F,D,E){this._div=SimileAjax.jQuery(F);
this._uiContext=D;
this._settings=E;
D.getDatabase().addListener(this);
this._initializeUI();
};
Exhibit.ChangeList._settingSpecs={submissionText:{type:"text",defaultValue:"Thanks for your submission! It has been sent to the exhibit author for approval."},placeholderText:{type:"text",defaultValue:"To begin editing this exhibit, click the 'edit' links on the exhibit items."},maxValueLength:{type:"int",defaultValue:50},trunctationString:{type:"text",defaultValue:"..."}};
Exhibit.UI.generateCreationMethods(Exhibit.ChangeList);
Exhibit.UI.registerComponent("change-list",Exhibit.ChangeList);
Exhibit.ChangeList.showSubmissionText=false;
Exhibit.ChangeList.prototype.dispose=function(){this._uiContext.getDatabase().removeListener(this);
this._div.innerHTML="";
this._div=null;
this._uiContext=null;
this._settings=null;
};
Exhibit.ChangeList.prototype.onAfterLoadingItems=function(){this._initializeUI();
};
Exhibit.ChangeList.prototype.addMockData=function(B){this._uiContext.getDatabase().addItem({label:"Gone With The Wind",type:"book",author:"Margaret Mitchell",year:"1936",availability:"available",owner:"Sarah",description:"Goin' down south"});
this._uiContext.getDatabase().editItem("White Noise","year","1990");
this._uiContext.getDatabase().editItem("White Noise","label","White Noice");
};
Exhibit.ChangeList.defaultMaxValueLength=50;
Exhibit.ChangeList.defaultTrunctationString="...";
Exhibit.ChangeList.prototype.makePlaceholder=function(){var B=SimileAjax.jQuery("<span>").addClass("placeholderMessage");
if(Exhibit.ChangeList.showSubmissionText){Exhibit.ChangeList.showSubmissionText=false;
B.text(this._settings.submissionText);
}else{B.text(this._settings.placeholderText);
}return B;
};
Exhibit.ChangeList.prototype.renderPropChange=function(I,H,N){var L=function(C,A,B){if(B){return SimileAjax.jQuery("<span>").text(C).addClass(A).attr("title",B);
}else{return SimileAjax.jQuery("<span>").text(C).addClass(A);
}};
var J=SimileAjax.jQuery("<div>").addClass("property-change");
var K;
var M=this._settings.trunctationString.length;
if(N.length-M>this._settings.maxValueLength){K=N;
N=N.slice(0,this._settings.maxValueLength-M)+"...";
}if(H){J.append(L(I,"property-name")," was changed from ",L(H,"old-value")," to ",L(N,"new-value",K));
}else{J.append(L(I,"property-name")," was set to ",L(N,"new-value",K));
}return J;
};
Exhibit.ChangeList.prototype.renderItem=function(I){var J=I.label+" was "+I.changeType;
var G=SimileAjax.jQuery("<div>").append(SimileAjax.jQuery("<div>").text(J).addClass("change-label"));
for(var H in I.vals){var F=I.vals[H];
G.append(this.renderPropChange(H,F.oldVal,F.newVal));
}return G;
};
Exhibit.ChangeList.prototype._initializeUI=function(){this._div.empty();
var C=this;
var D=this._uiContext.getDatabase().collectAllChanges();
D.sort(function(A,B){return A.label>B.label;
});
if(D.length==0){this._div.append(this.makePlaceholder());
if(Exhibit.Submission){Exhibit.Submission.disableWidgets();
}}else{if(Exhibit.Submission){Exhibit.Submission.enableWidgets();
}D.forEach(function(A){C._div.append(C.renderItem(A));
});
}};
(function(){var S=SimileAjax.jQuery;
Exhibit.CurateView=function(A,B){this._div=S(A).addClass("CurateView");
this._uiContext=B;
this._settings={};
this._accessors={};
this._submissions=null;
B.getCollection().addListener(this);
};
Exhibit.CurateView._settingSpecs={adminURL:{type:"text",defaultValue:"admin.py"}};
Exhibit.CurateView.create=function(C,D,A){var B=new Exhibit.CurateView(D,Exhibit.UIContext.create(C,A));
Exhibit.SettingsUtilities.collectSettings(C,Exhibit.CurateView._settingSpecs,B._settings);
B._initializeUI();
return B;
};
Exhibit.CurateView.createFromDOM=function(D,E,A){var C=Exhibit.getConfigurationFromDOM(D);
var B=new Exhibit.CurateView(E!=null?E:D,Exhibit.UIContext.createFromDOM(D,A));
Exhibit.SettingsUtilities.collectSettingsFromDOM(D,Exhibit.CurateView._settingSpecs,B._settings);
Exhibit.SettingsUtilities.collectSettings(C,Exhibit.CurateView._settingSpecs,B._settings);
B._initializeUI();
return B;
};
Exhibit.CurateView.prototype.dispose=function(){this._uiContext.getCollection().removeListener(this);
this._div.innerHTML="";
this._div=null;
this._uiContext=null;
this._settings=null;
this._accessors=null;
this._submissions=null;
};
Exhibit.CurateView.prototype.adminURL=function(){return this._settings.adminURL;
};
function O(A){return SimileAjax.JSON.toJSONString(A);
}function Q(B,A){return S('<input type="button">').val(B).click(A);
}function N(A){return exhibit.getDatabase().getProperty(A).getLabel();
}function L(A,B){return function(){A.find(".buttonDiv").attr("disabled",true);
var D=confirm("Are you sure you want to remove this submission? This action cannot be undone!");
if(D){var C={"command":"dismiss","sub_id":B.sub_id};
S.get(view.adminURL(),"message="+O(C),function(){A.remove();
});
}};
}function R(C,A){var B=C.find(".edit").map(function(){var D={label:S(this).attr("label"),values:{}};
S(this).find("input[property]").each(function(){var E=S(this).attr("property");
var F=S(this).val();
D.values[E]=F;
});
return D;
});
return{sub_id:A.sub_id,edits:B};
}function T(B,C,A){return function(){O(R(C,A));
};
}function K(B,C,D,F){var C=S("<div>").addClass("edit").attr("label",F.label);
var E=F.type=="modified"?"Changes to "+F.label:"New Item ("+F.label+")";
C.append(S("<div>").addClass("header").append(E));
var A=S("<table>").appendTo(C);
F.values.forEach(function(G){var H=S("<input>").val(G.value).attr("property",G.property);
A.append(S("<tr>").addClass("value").append(S("<td>").append(N(G.property)),S("<td>").append(H),S("<td>").append(S('<input type="checkbox">'))));
});
return C;
}function P(B,C,A){var C=S("<div>").addClass("submission").attr("sub_id",A.sub_id);
if(A.comment){C.append(S("<p>").text("Submittor's comment: "+A.comment));
}A.edits.forEach(function(E){C.append(K(B,C,A,E));
});
var D=S("<div>").addClass("buttonDiv").append(Q("Dismiss",L(B,C,A)),Q("Approve",T(B,C,A)));
C.append(D);
return C;
}function M(A){return function(B){Exhibit.CurateView._submissions=B;
A._div.empty();
A._div.append(S("<h1>").text("Submissions"));
B.forEach(function(C){A._div.append(P(A,A._div,C));
});
};
}Exhibit.CurateView.prototype._initializeUI=function(){var A=S("head link[rel=exhibit/submissions]");
if(A.length>0){var B=A.attr("href");
S.getJSON(B,M(this));
this._div.append(S("<h1>").text("Loading..."));
}else{this._div.append(S("<h1>").text("No submission link was provided!"));
}};
})();
Exhibit.ItemCreator=function(G,H,F){var E=H.getDatabase();
if(G.nodeName.toLowerCase()=="a"){G.href="javascript:";
}SimileAjax.jQuery(G).click(function(){if(Exhibit.ItemCreator.ItemBoxPresent){return ;
}var A={type:F.itemType};
Exhibit.ItemCreator.makeNewItemBox(H,A,F);
});
SimileAjax.jQuery(G).addClass("exhibit-itemCreator");
return G;
};
Exhibit.ItemCreator._settingSpecs={"itemType":{type:"text",defaultValue:"Item"},"automaticallySubmit":{type:"boolean",defaultValue:false},"submissionMessage":{type:"text"},"cancelButtonText":{type:"text",defaultValue:"Cancel"},"createButtonText":{type:"text",defaultValue:"Add Item"}};
Exhibit.UI.generateCreationMethods(Exhibit.ItemCreator);
Exhibit.UI.registerComponent("item-creator",Exhibit.ItemCreator);
Exhibit.ItemCreator.ItemBoxPresent=false;
Exhibit.ItemCreator.makeNewItemID=function(L,I){var J=L.getType(I).getLabel();
var G="Untitled "+J;
var H="";
var K=G;
while(L.containsItem(K)){H++;
K=G+" "+H;
}return K;
};
Exhibit.ItemCreator.makeNewItemBox=function(N,J,K){Exhibit.ItemCreator.ItemBoxPresent=true;
SimileAjax.jQuery(".exhibit-itemCreator").css("color","AAA");
var H=N.getDatabase();
K=K||{};
var L=$("<div><h1 class='exhibit-focusDialog-header' id='boxHeader'></h1><div class='exhibit-focusDialog-viewContainer' id='itemContainer'></div><div class='exhibit-focusDialog-controls'><button id='cancelButton' style='margin-right: 2em'>Cancel</button><button id='createButton' style='margin-left: 2em'>Add Item</button></div></div>");
if(K.title){L.find("#boxHeader").text(K.title);
}else{L.find("#boxHeader").remove();
}if(K.cancelButtonText){L.find("#cancelButton").text(K.cancelButtonText);
}if(K.createButtonText){L.find("#createButton").text(K.createButtonText);
}L.addClass("exhibit-focusDialog").addClass("exhibit-ui-protection");
L.css({top:document.body.scrollTop+100+"px",background:"#EEE repeat",paddingBottom:"0px"});
J.type=J.type||"item";
J.id=J.id||Exhibit.ItemCreator.makeNewItemID(H,J.type);
J.label=J.label||J.id;
H.addItem(J);
var M=L.find("#itemContainer").get(0);
N.getLensRegistry().createEditLens(J.id,M,N,{disableEditWidgets:true});
var I=function(){L.remove();
Exhibit.ItemCreator.ItemBoxPresent=false;
SimileAjax.jQuery(".exhibit-itemCreator").css("color","");
};
L.find("#cancelButton").click(function(){I();
database.removeItem(J.id);
});
L.find("#createButton").click(function(){if(K.automaticallySubmit){L.find(".exhibit-focusDialog-controls button").attr("disabled","disabled");
var B=function(){database.fixChangesForItem(J.id);
I();
if(K.submissionMessage){alert(K.submissionMessage);
}};
var A=function(D,C,E){alert("Error saving new item to server!\n\n"+C);
L.find(".exhibit-focusDialog-controls button").removeAttr("disabled");
};
Exhibit.SubmissionBackend.submitItemChanges(N,J.id,B,A);
}else{I();
}});
L.appendTo(document.body);
};
Exhibit.Scraper=function(I,J,H){if(!H.scraperInput){SimileAjax.Debug.warn("Scraper not given an input element!");
return ;
}var F=this._input=SimileAjax.jQuery("#"+H.scraperInput);
F.val("");
F.attr("disabled",false);
var I=this._elmt=SimileAjax.jQuery(I);
this._uiContext=J;
this._settings=H;
I.attr("href","javascript:");
var G=this;
I.click(function(){G.activate();
});
};
Exhibit.Scraper._settingSpecs={"scraperInput":{type:"text"},"itemType":{type:"text",defaultValue:"item"},"inputType":{type:"text",defaultValue:"auto"},"scraperService":{type:"text",defaultValue:"http://valinor.mit.edu/sostler/scraper.cgi"}};
Exhibit.UI.generateCreationMethods(Exhibit.Scraper);
Exhibit.UI.registerComponent("scraper",Exhibit.Scraper);
Exhibit.Scraper.prototype.activate=function(){var B=this._input.val();
if(this._settings.inputType=="auto"){if(B.startsWith("http://")){this.scrapeURL(B);
}else{this.scrapeText(B);
}}else{if(this._settings.inputType=="text"){this.scrapeText(B);
}else{if(this._settings.inputType.toLowerCase()=="url"){this.scrapeURL(B);
}else{SimileAjax.Debug.warn("Unknown scraper input type "+this._settings.inputType);
}}}};
Exhibit.Scraper.prototype.disableUI=function(){this._input.attr("disabled",true);
this._elmt.removeAttr("href");
this._elmt.css("color","AAA");
this._elmt.unbind();
};
Exhibit.Scraper.prototype.enableUI=function(){var B=this;
this._input.attr("disabled",false);
this._elmt.attr("href","javascript:");
this._elmt.css("color","");
SimileAjax.jQuery(this._elmt).click(function(){B.activate();
});
};
Exhibit.Scraper.prototype.scrapeURL=function(D){this.disableUI();
var F=this;
var E=function(A){var B=A.status;
if(B=="ok"){F.scrapePageSource(A.obj);
}else{if(B=="error"){alert("Error using scraper service!\n\n"+A.obj);
}else{alert("Unknown response from scraper service:\n\n"+B);
}}F.enableUI();
};
this.disableUI();
SimileAjax.jQuery.ajax({url:this._settings.scraperService,dataType:"jsonp",jsonp:"callback",data:{url:D},success:E});
};
Exhibit.Scraper.prototype.scrapeText=function(E){var F=null;
var D=Exhibit.ScraperBackend.extractItemFromText(E,this._settings.itemType,this._uiContext.getDatabase());
Exhibit.ItemCreator.makeNewItemBox(this._uiContext,D);
};
Exhibit.Scraper.prototype.scrapePageSource=function(E){var F=Exhibit.ScraperBackend.getTextFromPageSource(E);
var G=Exhibit.ScraperBackend.getTitleFromPageSource(E);
var H=Exhibit.ScraperBackend.extractItemFromText(F,this._settings.itemType,this._uiContext.getDatabase());
Exhibit.ItemCreator.makeNewItemBox(this._uiContext,H,{title:G});
};
Exhibit.ScraperBackend={};
Exhibit.ScraperBackend.getTitleFromPageSource=function(E){var F=document.createElement("div");
F.innerHTML=E.replace(/\s+/g," ");
var G=SimileAjax.jQuery(F);
var H=G.find("title").text();
return H;
};
Exhibit.ScraperBackend.getTextContents=function(E){function F(A,B){if(A.nodeType==3){B.push(A.data);
}else{if(A.nodeType==1){for(var C=A.firstChild;
C!=null;
C=C.nextSibling){F(C,B);
}}}}var D=[];
F(E,D);
return D.join("");
};
Exhibit.ScraperBackend.getTextFromPageSource=function(E){var F=document.createElement("div");
F.innerHTML=E.replace(/\s+/g," ");
var H=F.childNodes;
for(i=0;
i<H.length;
i++){var G=H[i];
if(G.nodeName.toLowerCase()=="style"||G.nodeName.toLowerCase()=="script"){F.removeChild(G);
}}return Exhibit.ScraperBackend.getTextContents(F);
};
Exhibit.ScraperBackend.findMostCommon=function(J,K){var L=0;
var O=null;
function I(A,B){A=A.toLowerCase();
var C=0;
var D=null;
while((D=B.indexOf(A,D))!=-1){C++;
D+=1;
}return C;
}for(var P=0;
P<J.length;
P++){var N=J[P];
var M=I(N,K);
if(M>L){L=M;
O=N;
}}return O;
};
Exhibit.ScraperBackend.extractItemFromText=function(H,I,L){var J={type:I};
var G=new Exhibit.Set();
G.add(I);
var K=L.getSubjectsUnion(G,"type");
H=H.toLowerCase();
L.getAllProperties().forEach(function(A){var C=L.getObjectsUnion(K,A).toArray();
var B=Exhibit.ScraperBackend.findMostCommon(C,H);
if(B){J[A]=B;
}});
return J;
};
Exhibit.SubmissionBackend={};
Exhibit.SubmissionBackend.formatChanges=function(D,C){return D.map(function(A){var B={id:A.id,label:A.label||A.id};
SimileAjax.jQuery.each(A.vals||{},function(G,H){G=G.toLowerCase();
B[G]=H.newVal;
});
SimileAjax.jQuery.each(C,function(G,H){G=G.toLowerCase();
if(G in B){throw"Collision between change property and submission property "+G+": "+B[G]+", "+H;
}else{B[G]=H;
}});
return B;
});
};
Exhibit.SubmissionBackend.SubmissionDefaults={"gdoc":{"url":"http://valinor.mit.edu/sostler/gdocbackend.cgi",}};
Exhibit.SubmissionBackend.getOutputOptions=function(){var C=$('head link[rel="exhibit/output"]');
if(C.length==0){throw"No output link provided";
}else{if(C.length>1){SimileAjax.Debug.warn("Multiple output links provided; ignoring all but the first");
}}var D={url:null,data:{}};
D.url=C.attr("ex:url")||Exhibit.SubmissionBackend.SubmissionDefaults.gdoc.url;
if(C.attr("ex:spreadsheetKey")){D.data.spreadsheetkey=C.attr("ex:spreadsheetKey");
}if(C.attr("ex:worksheetIndex")){D.data.worksheetindex=C.attr("ex:worksheetIndex");
}else{if(C.attr("ex:worksheetName")){D.data.worksheetname=C.attr("ex:worksheetName");
}else{D.data.worksheetindex="0";
}}return D;
};
Exhibit.SubmissionBackend.googleAuthSuccessWrapper=function(B){return function(A){SimileAjax.Debug.log("wrapped");
SimileAjax.Debug.log(A);
if(A.session){Exhibit.Authentication.GoogleSessionToken=A.session;
}B(A);
};
};
Exhibit.SubmissionBackend._submitChanges=function(G,H,E,F){H.data.json=SimileAjax.JSON.toJSONString(G);
if(Exhibit.Authentication.Enabled){if(Exhibit.Authentication.GoogleSessionToken){H.data.session=Exhibit.Authentication.GoogleSessionToken;
}else{if(Exhibit.Authentication.GoogleToken){H.data.token=Exhibit.Authentication.GoogleToken;
E=Exhibit.SubmissionBackend.googleAuthSuccessWrapper(E);
}else{SimileAjax.Debug.warn("Authentication is enabled, but no tokens are present");
}}}$.ajax({url:H.url,data:H.data,dataType:"jsonp",jsonp:"callback",success:E,error:F});
};
Exhibit.SubmissionBackend.submitAllChanges=function(L,G,H){var I=Exhibit.SubmissionBackend.getOutputOptions();
var J=L.getDatabase().collectAllChanges();
var K=Exhibit.SubmissionBackend.formatChanges(J,Exhibit.Submission.Properties);
Exhibit.SubmissionBackend._submitChanges(K,I,G,H);
};
Exhibit.SubmissionBackend.submitItemChanges=function(N,I,H,J){var K=Exhibit.SubmissionBackend.getOutputOptions();
var L=N.getDatabase().collectChangesForItem(I);
var M=Exhibit.SubmissionBackend.formatChanges([L],Exhibit.Submission.Properties);
Exhibit.SubmissionBackend._submitChanges(M,K,H,J);
};
Exhibit.Submission={};
Exhibit.Submission.submissionWidgets=["submission-property","submission-button"];
Exhibit.Submission.enableWidgets=function(){Exhibit.UI.findAttribute("ex:role",Exhibit.Submission.submissionWidgets).removeAttr("disabled");
};
Exhibit.Submission.disableWidgets=function(){Exhibit.UI.findAttribute("ex:role",Exhibit.Submission.submissionWidgets).attr("disabled",true);
};
Exhibit.Submission.resetAfterSubmission=function(B){Exhibit.UI.findAttribute("ex:role","submission-property").val("");
Exhibit.Submission.Properties={};
B.getDatabase().fixAllChanges();
Exhibit.Submission.enableWidgets();
Exhibit.ChangeList.showSubmissionText=true;
B.getDatabase()._listeners.fire("onAfterLoadingItems",[]);
};
Exhibit.Submission.Properties={};
Exhibit.SubmissionProperty=function(F,D,E){F.value="";
if(!E.propertyName){SimileAjax.Debug.warn("No propertyName given for SubmissionProperty");
}else{SimileAjax.jQuery(F).change(function(){Exhibit.Submission.Properties[E.propertyName]=F.value;
});
}};
Exhibit.SubmissionProperty._settingSpecs={propertyName:{type:"text"}};
Exhibit.UI.generateCreationMethods(Exhibit.SubmissionProperty);
Exhibit.UI.registerComponent("submission-property",Exhibit.SubmissionProperty);
Exhibit.SubmissionButton=function(H,E,G){var F=function(){Exhibit.Submission.disableWidgets();
var B=function(){alert("Changes successfully made!");
Exhibit.Submission.resetAfterSubmission(E);
};
var A=function(){alert("Error submitting data!");
Exhibit.Submission.enableWidgets();
};
Exhibit.SubmissionBackend.submitAllChanges(E,B,A);
};
SimileAjax.jQuery(H).click(F);
};
Exhibit.SubmissionButton._settingSpecs={};
Exhibit.UI.generateCreationMethods(Exhibit.SubmissionButton);
Exhibit.UI.registerComponent("submission-button",Exhibit.SubmissionButton);


/* compile-epilog.js */
(function(){var f=null;
if("SimileWidgets_onLoad" in window){if(typeof SimileWidgets_onLoad=="string"){f=eval(SimileWidgets_onLoad);
SimileWidgets_onLoad=null;
}else{if(typeof SimileWidgets_onLoad=="function"){f=SimileWidgets_onLoad;
SimileWidgets_onLoad=null;
}}}if(f!=null){f();
}})();