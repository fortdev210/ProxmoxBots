/*******************************************************************************

    uBlock Origin - a browser extension to block requests.
    Copyright (C) 2016-present Raymond Hill

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see {http://www.gnu.org/licenses/}.

    Home: https://github.com/gorhill/uBlock
*/

/* global CodeMirror, uDom, uBlockDashboard */

'use strict';

/******************************************************************************/

{
// >>>> Start of private namespace

/******************************************************************************/

let defaultSettings = new Map();
let beforeHash = '';

/******************************************************************************/

CodeMirror.defineMode('raw-settings', function() {
    let lastSetting = '';

    return {
        token: function(stream) {
            if ( stream.sol() ) {
                stream.eatSpace();
                const match = stream.match(/\S+/);
                if ( match !== null && defaultSettings.has(match[0]) ) {
                    lastSetting = match[0];
                    return 'keyword';
                }
                stream.skipToEnd();
                return 'line-cm-error';
            }
            stream.eatSpace();
            const match = stream.match(/.*$/);
            if (
                match !== null &&
                match[0].trim() !== defaultSettings.get(lastSetting)
            ) {
                return 'line-cm-strong';
            }
            stream.skipToEnd();
            return null;
        }
    };
});

const cmEditor = new CodeMirror(
    document.getElementById('advancedSettings'),
    {
        autofocus: true,
        lineNumbers: true,
        lineWrapping: false,
        styleActiveLine: true
    }
);

uBlockDashboard.patchCodeMirrorEditor(cmEditor);

/******************************************************************************/

const hashFromAdvancedSettings = function(raw) {
    const aa = typeof raw === 'string'
        ? arrayFromString(raw)
        : arrayFromObject(raw);
    aa.sort((a, b) => a[0].localeCompare(b[0]));
    return JSON.stringify(aa);
};

/******************************************************************************/

const arrayFromObject = function(o) {
    const out = [];
    for ( const k in o ) {
        if ( o.hasOwnProperty(k) === false ) { continue; }
        out.push([ k, `${o[k]}` ]);
    }
    return out;
};

const arrayFromString = function(s) {
    const out = [];
    for ( let line of s.split(/[\n\r]+/) ) {
        line = line.trim();
        if ( line === '' ) { continue; }
        const pos = line.indexOf(' ');
        let k, v;
        if ( pos !== -1 ) {
            k = line.slice(0, pos);
            v = line.slice(pos + 1);
        } else {
            k = line;
            v = '';
        }
        out.push([ k.trim(), v.trim() ]);
    }
    return out;
};

/******************************************************************************/

// This is to give a visual hint that the content of user blacklist has changed.

const advancedSettingsChanged = (( ) => {
    let timer;

    const handler = ( ) => {
        timer = undefined;
        const changed =
            hashFromAdvancedSettings(cmEditor.getValue()) !== beforeHash;
        uDom.nodeFromId('advancedSettingsApply').disabled = !changed;
        CodeMirror.commands.save = changed ? applyChanges : function(){};
    };

    return function() {
        if ( timer !== undefined ) { clearTimeout(timer); }
        timer = vAPI.setTimeout(handler, 100);
    };
})();

cmEditor.on('changes', advancedSettingsChanged);

/******************************************************************************/

const renderAdvancedSettings = async function(first) {
    const details = await vAPI.messaging.send('dashboard', {
        what: 'readHiddenSettings',
    });
    defaultSettings = new Map(arrayFromObject(details.default));
    beforeHash = hashFromAdvancedSettings(details.current);
    const pretty = [];
    const entries = arrayFromObject(details.current);
    let max = 0;
    for ( const [ k ] of entries ) {
        if ( k.length > max ) { max = k.length; }
    }
    for ( const [ k, v ] of entries ) {
        pretty.push(' '.repeat(max - k.length) + `${k} ${v}`);
    }
    pretty.push('');
    cmEditor.setValue(pretty.join('\n'));
    if ( first ) {
        cmEditor.clearHistory();
    }
    advancedSettingsChanged();
    cmEditor.focus();
};

/******************************************************************************/

const applyChanges = async function() {
    await vAPI.messaging.send('dashboard', {
        what: 'writeHiddenSettings',
        content: cmEditor.getValue(),
    });
    renderAdvancedSettings();
};

/******************************************************************************/

uDom.nodeFromId('advancedSettings').addEventListener(
    'input',
    advancedSettingsChanged
);
uDom.nodeFromId('advancedSettingsApply').addEventListener('click', ( ) => {
    applyChanges();
});

renderAdvancedSettings(true);

/******************************************************************************/

// <<<< End of private namespace
}
