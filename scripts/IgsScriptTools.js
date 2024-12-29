
/*
This script is part of IGLib Scripts (the Investigative Generic Library's scripts).
Copyright © Igor Grešovnik
*/

/******************/
/*                */
/*   TIMESTAMPS   */
/*                */
/******************/

/**
Returns a timestamp to mark the current time.
This creates the longer ISO form that includes elements from year down to milliseconds and has constant length.
 */
function igsGetTimestampIso() {
    const t = new Date();
    return t.toISOString();
}

/**
Returns a timestamp to mark the current time.
This creates a shorter form that includes time of the day from hours down to milliseconds, restating every day,
as UTC time. Timestamp length is constant.
 */
function igsGetTimestampShort() {
    const t = new Date();
    const timestamp = `${t.getUTCHours().toString().padStart(2, "0")}:${t.getUTCMinutes().toString().padStart(2, "0")}:${t.getUTCSeconds().toString().padStart(2, "0")}.${t.getUTCMilliseconds().toString().padStart(3, "0")}`
    return timestamp;
}


/**
Returns a timestamp to mark the current time.
This creates a shorter form that includes time of the day from hours down to milliseconds, restating every day,
as local time. Timestamp length is constant.
 */
function igsGetTimestampShortLocal() {
    const t = new Date();
    const timestamp = `${t.getHours().toString().padStart(2, "0")}:${t.getMinutes().toString().padStart(2, "0")}:${t.getSeconds().toString().padStart(2, "0")}.${t.getMilliseconds().toString().padStart(3, "0")}`
    return timestamp;
}

/**
Returns a timestamp to mark the current time.
This creates a short numerical form that includes time of the day in decimal seconds and milliseconds, restating every day,
as local time. Timestamp length is not constand.
 */
function igsGetTimestampShortNumeric() {
    const t = new Date();
    const timestamp = `${t.getHours() * 60 * 60 + t.getMinutes() * 60 + t.getSeconds() + t.getMilliseconds() / 1000} s`
    return timestamp;
}



/**************/
/*            */
/*   ALERTS   */
/*            */
/**************/


/**
* Creates HTML element containing an alert to be visibly displayed in the 
* loaded document, according to parameters. Appearance is styled by class parameters.
* Alert's message is intended to be displayed in distinctively styled HTML on top of 
* the regulat document content.
* @param title sp        * ecifies the title of the alert, which should signift type or 
* severity of the alert (such as "Warning:", "Error:", etc.)
* @param message specifies the messagedisplayed by the alert that provides specific info        rmation 
    to the user. It can contain HTML markup, which is parsed and rendered properly.
* @param classMessageCategory is the class attribute applied to the whole category of alerts
* for styling.
* @param classMessageType is the class attribute  applied for stypling the specific type of 
*  alert for styling.
* @param classCloseButton is the class applied to the close button.
* @param closingDelay is th delay, in milliseconds, before the alert becomes invisible after the user
* closes it via the close button or mouse click.
*/
function igsCreateAlertDiv(
    title = "Warning:",
    message = "This is a message IgsAlert.",
    classMessageCategory = "IgsAlert",
    classMessageType = "IgsWarning",
    classCloseButton = "IgsCloseButton",
    closingDelay = 250
) {
    try {
        const alertDiv = document.createElement('div');
        alertDiv.className = `${classMessageCategory} ${classMessageType}`;
        const closeSpan = document.createElement('span');
        closeSpan.className = classCloseButton;
        closeSpan.innerHTML = '&times;';
        const timespanElement = document.createElement('span');
        const timestamp = igsGetTimestampShort();
        timespanElement.innerText = timestamp + ": ";
        const titleElement = document.createElement('strong');
        titleElement.textContent = title;
        const messageElement = document.createElement('span');
        messageElement.innerHTML = ` ${message}`;
        alertDiv.appendChild(closeSpan);
        alertDiv.appendChild(timespanElement);
        alertDiv.appendChild(titleElement);
        alertDiv.appendChild(messageElement);
        const handleClose = () => {
            alertDiv.style.opacity = "0";
            setTimeout(() => {
                alertDiv.style.display = "none";
            }, closingDelay);
        };
        closeSpan.addEventListener('click', handleClose);
        return alertDiv;
    }
    catch (error) {
        igsLogError("igsCreateAlertDiv: " + error.name + ": " + error.message);
    }
}


/**
Creates HTML element containing an alert and adds it to the document, such that the alert is 
visually displayed. The element is added at the top of the document.
This method must be called afer the HTML document's DOM has been loaded, such that the HTML
element containing the alert markup can be inserted into the document. E.g., call the method
from a script inside HTML body, or call it on the DOMContentLoaded event.  
Parameters have the same meaning as with the {@link igsCreateAlertDiv} method.
*/
function igsLaunchAlertDiv(
    title = "Warning:",
    message = "This is a message IgsAlert.",
    classMessageCategory = "IgsAlert",
    classMessageType = "IgsWarning",
    classCloseButton = "IgsCloseButton",
    closingDelay = 250
) {
    try {
        // Create alert's HTML elements:
        const alertHtml = igsCreateAlertDiv(
            title, message, classMessageCategory,
            classMessageType, classCloseButton, closingDelay);
        // Insert the alert before the first element of the body:
        const firstBodyElement = document.body.firstChild;
        if (firstBodyElement != null) {
            document.body.insertBefore(alertHtml, firstBodyElement);
        } else {
            document.body.appendChild(alertHtml);
        }
    }
    catch (error) {
        igsLogError("igsLaunchAlertDiv: " + error.name + ": " + error.message);
    }
}

/**
Launches alert of type Success via the {@link igsLaunchAlertDiv} method by using
standard parameters. The alert is launched immediately, regardless of readiness of DOM.
If DOM is not ready then the function is called, the alert will not be visible.
@param message is the message displayed in the alert, and can contain HTML markup.
*/
function igsLaunchAlertSuccessImmediately(message = "This is a success alert.", logToConsole = true) {
    try {
        igsLaunchAlertDiv(
            "Success:",
            message,
            "IgsAlert",
            "IgsSuccess",
            "IgsCloseButton",
            100
        );
        if (logToConsole) {
            igsLogSuccess("Launched alert: " + message
                .replaceAll("<br>", "\n").replaceAll("&nbsp;", " ").replaceAll("<br/>", "\n"));
        }
    }
    catch (error) {
        igsLogError("igsLaunchAlertSuccessImmediately: " + error.name + ": " + error.message);
    }
}

/**
Launches alert of type Success via the {@link igsLaunchAlertDiv} method by using
standard parameters. The alert is launched when DOM is ready.
@param message is the message displayed in the alert, and can contain HTML markup.
*/
function igsLaunchAlertSuccess(message = "This is a success alert.", logToConsole = true) {
    igsDoWhenDomReady(() => { igsLaunchAlertSuccessImmediately(message, logToConsole); });
}

/**
Launches alert of type Info via the {@link igsLaunchAlertDiv} method by using
standard parameters. The alert is launched immediately, regardless of readiness of DOM.
If DOM is not ready then the function is called, the alert will not be visible.
@param message is the message displayed in the alert, and can contain HTML markup.
*/
function igsLaunchAlertInfoImmediately(message = "This is an info alert.", logToConsole = true) {
    try {
        igsLaunchAlertDiv(
            "Info:",
            message,
            "IgsAlert",
            "IgsInfo",
            "IgsCloseButton",
            100
        );
        if (logToConsole) {
            igsLogInfo("Launched alert: " + message
                .replaceAll("<br>", "\n").replaceAll("&nbsp;", " ").replaceAll("<br/>", "\n"));
        }
    }
    catch (error) {
        igsLogError("igsLaunchAlertInfoImmediately: " + error.name + ": " + error.message);
    }
}

/**
Launches alert of type Info via the {@link igsLaunchAlertDiv} method by using
standard parameters. The alert is launched when DOM is ready.
@param message is the message displayed in the alert, and can contain HTML markup.
*/
function igsLaunchAlertInfo(message = "This is a success alert.", logToConsole = true) {
    igsDoWhenDomReady(() => { igsLaunchAlertInfoImmediately(message, logToConsole); });
}

/**
Launches alert of type Warning via the {@link igsLaunchAlertDiv} method by using
standard parameters. The alert is launched immediately, regardless of readiness of DOM.
If DOM is not ready then the function is called, the alert will not be visible.
@param message is the message displayed in the alert, and can contain HTML markup.
*/
function igsLaunchAlertWarningImmediately(message = "This is a warning alert.", logToConsole = true) {
    try {
        igsLaunchAlertDiv(
            "Warning:",
            message,
            "IgsAlert",
            "IgsWarning",
            "IgsCloseButton",
            100
        );
        if (logToConsole) {
            igsLogWarning("Launched alert: " + message
                .replaceAll("<br>", "\n").replaceAll("&nbsp;", " ").replaceAll("<br/>", "\n"));
        }
    }
    catch (error) {
        igsLogError("igsLaunchAlertWarningImmediately: " + error.name + ": " + error.message);
    }
}

/**
Launches alert of type Warning via the {@link igsLaunchAlertDiv} method by using
standard parameters. The alert is launched when DOM is ready.
@param message is the message displayed in the alert, and can contain HTML markup.
*/
function igsLaunchAlertWarning(message = "This is a success alert.", logToConsole = true) {
    igsDoWhenDomReady(() => { igsLaunchAlertWarningImmediately(message, logToConsole); });
}

/**
Launches alert of type Error via the {@link igsLaunchAlertDiv} method by using
standard parameters.
@param error can be the string message displayed in the alert and can contain HTML markup,
or it can be an object that was thrown as exception, in which case displayed message
is formed based on it.
It can also be an object thrown as error, which can be a string, number, boolean, or
object (standard error object has "name" and "message" properties). For standard error
objects, a special display message is formed, and for arbitrart objects, the message 
is obtained by JSON-serializing the object.
*/
function igsLaunchAlertErrorImmediately(error = "This is an error alert.", logToConsole = true) {
    try {
        let message = error;
        if (typeof (error) === "object") {
            if (message.name != undefined && message.message != undefined) {
                message = error.name + ": " + error.message
            } else {
                message = JSON.stringify(error);
            }
        }
        igsLaunchAlertDiv(
            "Error:",
            message,
            "IgsAlert",
            "IgsError",
            "IgsCloseButton",
            100
        );
        if (logToConsole) {
            igsLogError("Launched alert: " + message
                .replaceAll("<br>", "\n").replaceAll("&nbsp;", " ").replaceAll("<br/>", "\n"));
        }
    }
    catch (error) {
        igsLogError("igsLaunchAlertErrorImmediately: " + error.name + ": " + error.message);
    }
}


/**
Launches alert of type Error via the {@link igsLaunchAlertDiv} method by using
standard parameters. The alert is launched when DOM is ready.
@param message is the message displayed in the alert, and can contain HTML markup.
*/
function igsLaunchAlertError(message = "This is a success alert.", logToConsole = true) {
    igsDoWhenDomReady(() => { igsLaunchAlertErrorImmediately(message, logToConsole); });
}


function igsLogSuccess(message = "Success.") {
    try {
        const timestamp = igsGetTimestampShort();
        console.info(`${timestamp} Success: ${message}`);
    }
    catch (error) {
        igsLogError("igsLogSuccess: " + error.name + ": " + error.message);
    }
}

function igsLogInfo(message = "Info.") {
    try {
        const timestamp = igsGetTimestampShort();
        console.info(`${timestamp} Info: ${message}`);
    }
    catch (error) {
        igsLogError("igsLogInfo: " + error.name + ": " + error.message);
    }
}

function igsLogWarning(message = "Warning.") {
    try {
        const timestamp = igsGetTimestampShort();
        console.warn(`${timestamp} Warning: ${message}`);
    }
    catch (error) {
        igsLogError("igsLogWarning: " + error.name + ": " + error.message);
    }
}

/**
logs an error to console.
@param error can be the string message displayed in the alert and can contain HTML markup,
or it can be an object that was thrown as exception, in which case displayed message
is formed based on it.
It can also be an object thrown as error, which can be a string, number, boolean, or
object (standard error object has "name" and "message" properties). For standard error
objects, a special display message is formed, and for arbitrart objects, the message 
is obtained by JSON-serializing the object.
*/
function igsLogError(error = "Error.") {
    try {
        let message = error;
        if (typeof (error) === "object") {
            if (message.name != undefined && message.message != undefined) {
                message = error.name + ": " + error.message
            } else {
                message = JSON.stringify(error);
            }
        }
        const timestamp = igsGetTimestampShort();
        console.error(`${timestamp} Error: ${message}`);
    }
    catch (error) {
        console.error('igsLogError: ' + error.name + ": " + error.message);
    }
}


/*************/
/*           */
/*   SLEEP   */
/*           */
/*************/

/**
Blocks the current thread for the specified number of milliseconds. This is done by
running a CPU intensive loop! Only use this for special means of testing.
@param milliSeconds is the time, in milliseconts, for which the thread is blocked.
*/
function sleepMs(milliSeconds) {
    try {
        let now = new Date().getTime();
        while (new Date().getTime() < now + milliSeconds) {
            // do nothing
        }
    }
    catch (error) {
        igsLogError("sleepMs: " + error.name + ": " + error.message);
    }
}

/**
Blocks the current thread for the specified number of seconds, which does not need to be
an integer, wihth a resolution of 1 ms. This is done by running a CPU intensive loop! 
Only use this for special means of testing and never in production.
@param seconds is the time, in seconds, for which the thread will block. Can be a floating
point number, but the best resolution is 1e-3 (a millisecond).
*/
function sleep(seconds) {
    sleepMs(seconds * 1000);
}


/**********************************/
/*                        */
/*   DOCUMENT READINESS, DELAYS   */
/*                        */
/**********************************/

/**
Returns true if the document's DOM has already been loaded and can be interacted with (this
does not mean that the document / page has been loaded completely, there may be external
resources that are still loading).
See: https://stackoverflow.com/questions/8100576/how-to-check-if-dom-is-ready-without-a-framework
*/
function igsIsDomReady() {
    if (document.readyState != 'loading') {
        return false;
    }
    return (document.readyState === 'interactive' || document.readyState === 'complete');
}


/**
Executes the specified function at the first opportunity when document's DOM is loaded. This
makes sure that the function can correctly interact with socument's DOM.
@param executedFunction is the function that is executed as soon as the document's DOM is 
loaded and can be interacted with.
At the time the function is called, external resources may still being loaded.
*/
function igsDoWhenDomReady(executedFunction) {
    try {
        if (document.readyState != 'loading') {
            executedFunction();
        } else if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', executedFunction);
        } else {
            document.attachEvent('onreadystatechange', function () {
                if (document.readyState != 'loading')
                    executedFunction();
            });
        }
    }
    catch (error) {
        igsLogError("igsDoWhenDomReady: " + error.name + ": " + error.message);
    }
}

/**
 * Executes the specified function after the specified delay, or DOM readiness, or immediately.
 * @param delayMsOrReadiness: specifies when the executedFunction is called.
 *   If greater than 0 then function is called after the delay, in milliseconds, specified by 
 *   this parameter. Delay is counted AFTER the DOM gets ready (or immediately if it is
 *   already ready when this function is called). If 0 then function is called as soon as
 *   DOM gets ready (imediately if this is already the case). If -1 or less then the function
 *   is called immediately, regardless of the DOM readiness state. 
 * @param executedFunction: the function that is called by this function.
*/
function igsDoWhenTimeMs(delayMsOrReadiness, executedFunction) {
    try {
        if (delayMsOrReadiness < 0) {
            // delayMsOrReadiness is less than 0, execute the functionn immediately:
            executedFunction();
            return;
        }
        igsDoWhenDomReady(() => {
            // Act when DOM gets ready...
            if (delayMsOrReadiness == 0) {
                // delayMsOrReadiness is 0, execute immediately after DOM gets ready:
                executedFunction();
                return;
            }
            // delayMsOrReadiness > 0: after DOM gets ready, execute with the specified delay:
            setTimeout(() => {
                executedFunction();
            }, delayMsOrReadiness);
        });
    }
    catch (error) {
        igsLogError("igsDoWhenTimeMs: " + error.name + ": " + error.message);
    }
}



/**********************/
/*                    */
/*    CANONIZATION    */
/*                    */
/**********************/


/**
Checks whether the current URL is canonical, and launches alerts informing the user of the
result, including any details on why the URL is not canonical.
*/
function igsCheckDocumentUrlCanonization() {
    try {
        const url = window.location.href;
        const referrer = document.referrer;
        igsLaunchAlertInfo(`The current URL is: ${url} <br>Referrer: ${referrer} <br>History:<br>${JSON.stringify(history)}`, true);
        let isInsecure = false
        let isIndexUrl = false;
        if (url.startsWith("http://")) {
            isInsecure = true;
        }
        if (url.endsWith("index.html")) {
            isIndexUrl = true;
        }
        if (url.startsWith("file://")) {
            igsLaunchAlertWarning(`This is a file URL. Canonicalization can only be done on web URLs.`, true);
            return;
        }
        igsLaunchAlertInfo(`isInsecure: ${isInsecure}, isIndexUrl: ${isIndexUrl}, !(isInsecure || isIndexUrl): ${!(isInsecure || isIndexUrl)}`,
            true);
        if (!(isInsecure || isIndexUrl)) {
            igsLaunchAlertSuccess(`The URL is canonical.`, true);
        } else {
            let message = "The URL is NOT canonical.";
            if (isInsecure) {
                message += "<br/>&nbsp;&nbsp;The URL is not secure protocol; canonical URLs should use secure protocol."
            }
            if (isIndexUrl) {
                message += "<br/>&nbsp;&nbsp;The URL contains name index.html. Agreement for canonical URLs is to relace index.html with directory form."
            }
            igsLaunchAlertWarning(message, true);
        }
    }
    catch (error) {
        igsLaunchAlertError("igsCheckDocumentUrlCanonization: " + error.name + ": " + error.message);
    }
}


/**
Checks whether the current URL is canonical, and launches alerts informing the user of the
result, including any details on why the URL is not canonical.
This is done only when the document's DOM is loaded and can be interacted with. If the DOM
is still loading at the time of the function call, the check will be performed after the DOM
is ready (via the appropriate event).
*/
function igsCheckDocumentUrlCanonizationWhenDomReady() {
    igsDoWhenDomReady(igsCheckDocumentUrlCanonization);
}

/**
Checks whether the current URL is canonical, and if not, it redireects the brower window
to the canonical form of the current URL. In the process, it also launches alerts informing 
the user of the results and the redirection.
*/
function igsCanonicalRedirect() {
    try {
        igsLogInfo("Trying to perform canonical redirect...");
        const url = window.location.href;
        const referrer = document.referrer;
        igsLogInfo(`The current URL is: ${url} <br>Referrer: ${referrer}`);
        if (!(url.startsWith("https://") || url.startsWith("http://"))) {
            if (url.startsWith("file://")) {
                igsLogWarning(`This is a file URL. Canonicalization can only be done on web URLs.`);
                return;
            } else {
                igsLogWarning(`This is a relative link. Canonicalization can only be done on web URLs.`);
            }
            return;
        }
        let isInsecure = false
        let isIndexUrl = false;
        if (url.startsWith("http://")) {
            isInsecure = true;
        }
        if (url.endsWith("index.html")) {
            isIndexUrl = true;
        }
        igsLogInfo(`isInsecure: ${isInsecure}, isIndexUrl: ${isIndexUrl}, !(isInsecure || isIndexUrl): ${!(isInsecure || isIndexUrl)}`);
        if (!(isInsecure || isIndexUrl)) {
            igsLogSuccess("The URL is canonical.");
        } else {
            let message = "The URL is NOT canonical.";
            if (isInsecure) {
                message += "<br/>&nbsp;&nbsp;The URL is not secure protocol; canonical URLs should use secure protocol."
            }
            if (isIndexUrl) {
                message += "<br/>&nbsp;&nbsp;The URL contains name index.html. Agreement for canonical URLs is to relace index.html with directory form."
            }
            igsLogWarning(message);
            // redirect to canonical URL:
            const canonicalUrl = url.replace("http://", "https://")
                .replace("index.html", "");
            igsLogInfo(`The page is being redirected to ${canonicalUrl}...`);
            // Perform the redirect; use location.replace(...) instead of location.href = ...,
            // such that history entry of the original page URL is replaced by the target
            // (vanonical) URL, which will prevent the situation where the back button gets to
            // the original URL just to be immediately redirected back to canonical URL, putting
            // the back button into a deadlock:
            window.location.replace(canonicalUrl);
            igsLogSuccess(`... redirection completed.`);
            igsLogInfo(`After redirection: <br>&nbsp; url: ${window.location.href} <br>&nbsp; url: referrer: ${document.referrer}`);
        }
    }
    catch (error) {
        igsLogError("igsCanonicalRedirect: " + error.name + ": " + error.message);
    }
    finally {
        igsLogInfo("  ... finished: canonical redirect.");
    }
}


/**
Checks whether the current URL is canonical, and if not, it redireects the brower window
to the canonical form of the current URL. In the process, it also launches alerts informing 
the user of the results and the redirection.
This is done only when the document's DOM is loaded and can be interacted with. If the DOM
is still loading at the time of the function call, the check will be performed after the DOM
is ready (via the appropriate event).
*/
function igsCanonicalRedirectWhenDomReady() {
    igsDoWhenDomReady(igsCanonicalRedirect);
}


/*********************/
/*                   */
/*    REDIRECTION    */
/*                   */
/*********************/


/**
 * Performs immediate redirection to the specified URL.
 * Redirection is performed in such a way that the original URL of the page is not stored
 * in the history, such that infinite loop of redirections is prevented when the back button
 * is clicked in the browser.
 * @param {any} newUrl - the URL to which the current page is redirected.
 */
function igsRedirectPlain(newUrl) {
    window.location.replace(newUrl);
}


/**
 * Redirects to the specified URL after the specified delay, or DOM readiness, or immediately.
 * If redirection is performed with a delay (newUrl > 0) then an inline info alert is launched
 * with information about the imminent redirection.
 * @param delayMsOrReadiness: specifies when the redirection is performed.
 *   If greater than 0 then redirection is performed after the delay, in milliseconds, specified 
 *   by this parameter. Delay is counted AFTER the DOM gets ready (or immediately if it is
 *   already ready when this function is called). If 0 then function is called as soon as
 *   DOM gets ready (imediately if this is already the case). If -1 or less then redirection
 *   is performed immediately, regardless of the DOM readiness state. 
 * @param newUrl: the target URL to which redirection is performed.
*/
function igsRedirectWhenTimeMs(delayMsOrReadiness, newUrl) {
    try {
        if (delayMsOrReadiness > 0) {
            const seconds = delayMsOrReadiness / 1000;
            igsLaunchAlertWarning(`This page will be <b>redirected to</b>:<br>  <a href='${newUrl}'>${newUrl}</a><br> in ${seconds} seconds.`);
        }
        igsDoWhenTimeMs(delayMsOrReadiness, () => { igsRedirectPlain(newUrl); });
    }
    catch (error) {
        igsLogError("igsRedirectWhenTimeMs: " + error.name + ": " + error.message);
    }
}

// READING URL PARAMETERS:

/**
 * Retrieves and returns value of the specified URL parameter from URL of the current page.
 * null is returned if the parameter is not specified in the URL.
 * Example: In URL https://www.example.com/index.html?delay=5000
 * parameter named "delayms" has the value of "5000". This is returned when on this page, we call
 *   igsGetUrlParameter("delayms");
 * We can convert the returned string value to a number by using the Number(...) constructor.
 * @param {any} parameterName: name of the URL parameter to be returned.
 * @returns value of the parameter
 */
function igsGetUrlParameter(parameterName) {
    try {
        const url_string = window.location.href;
        let url = new URL(url_string);
        let param = url.searchParams.get(parameterName);
        return param;
    }
    catch (error) {
        igsLogError("igsGetUrlParameter: " + error.name + ": " + error.message);
    }
}

