/***********************************************************************************
 * This file is copied from dist/aot/utils.js in @ionic/app-scripts@3.1.2, and then
 * modified by Stimulating Solutions to work with an unmodified main.ts from the
 * angular-meteor WhatsApp/Ionic tutorial:
 * https://angular-meteor.com/tutorials/whatsapp2/ionic/setup
 * https://github.com/Urigo/Ionic2CLI-Meteor-WhatsApp/blob/2e24939df882c0a7100d3885f55c30402b6e6c3a/src/app/main.ts
 *
 * The modification, use, and distribution of this file as described above is
 * allowed under the following license:
 *
 ***********************************************************************************
 *
 * MIT License
 *
 * Copyright (c) 2016 Drifty Co
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 **********************************************************************************/


"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var typescript_1 = require("typescript");
var typescript_utils_1 = require("../util/typescript-utils");
function getFallbackMainContent() {
    return "import 'meteor-client';\n\nimport { platformBrowser } from '@angular/platform-browser';\nimport { MeteorObservable } from 'meteor-rxjs';\nimport { Meteor } from 'meteor/meteor';\nimport { enableProdMode } from '@angular/core';\nimport { AppModuleNgFactory } from './app.module.ngfactory';\n\nMeteor.startup(function() {\n\n  var subscription = MeteorObservable.autorun().subscribe(function() {\n\n    if (Meteor.loggingIn()) {\n      return;\n    }\n\n    setTimeout(function() { if (subscription) subscription.unsubscribe() });\n\n    enableProdMode();\n    platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);\n  });\n});"
}
exports.getFallbackMainContent = getFallbackMainContent;
exports.replaceBootstrapImpl = getFallbackMainContent;
