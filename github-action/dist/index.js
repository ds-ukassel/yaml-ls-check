"use strict";var O=Object.create;var R=Object.defineProperty;var q=Object.getOwnPropertyDescriptor;var J=Object.getOwnPropertyNames;var N=Object.getPrototypeOf,z=Object.prototype.hasOwnProperty;var G=(t,e,r,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of J(e))!z.call(t,n)&&n!==r&&R(t,n,{get:()=>e[n],
enumerable:!(i=q(e,n))||i.enumerable});return t};var g=(t,e,r)=>(r=t!=null?O(N(t)):{},G(e||!t||!t.__esModule?R(r,"default",{value:t,enumerable:!0}):r,t));var c=g(require("@actions/core")),I=g(require("path"));var v=g(require("fs")),m=g(require("path")),T=require("yaml-language-server/out/server/src/languageservice/services/yamlSchemaService"),
Y=require("yaml-language-server/out/server/src/languageservice/services/yamlValidation"),F=require("yaml-language-server/out/server/src/languageservice/services/yamlHover"),
D=require("vscode-languageserver-textdocument");var V=g(require("fs")),u=g(require("path")),x=require("vscode-uri");function $(t,e){let r=0;for(;r<t.length&&t[r]===e;)++r;
return r>0?t.substring(r):t}var W=(t,e)=>t?x.URI.file(u.join(t,x.URI.parse(e).fsPath)).toString():u.normalize(e);function k(t){
return JSON.parse(V.readFileSync(t).toString())}var A=g(require("fs")),S=require("vscode-uri"),C=require("yaml-language-server/out/server/src/languageservice/utils/paths");function L(t){return async e=>{if(!e)return Promise.reject("No schema specified");t&&(0,C.isRelativePath)(e)&&(e=W(t,e));
let r=S.URI.parse(e).scheme.toLowerCase();if(/^[a-z]:[\\/]/i.test(e)){let n=S.URI.file(e);r=n.scheme.toLowerCase(),e=n.toString()}
if(r==="file")return new Promise((n,s)=>{let p=$(S.URI.parse(e).fsPath,"\\");A.readFile(p,(l,f)=>(l&&console.error(`Coul\
d not find schema file at: ${p}`),l?s(""):n(f.toString())))});let i=await fetch(e);return i.ok?i.text():Promise.reject(`\
Unable to load schema at ${e}: ${i.statusText}`)}}var j=require("glob"),P=class{constructor(){}send(e){console.error("send:",e)}sendError(e,r){console.error("sendError:",
e,r)}sendTrack(e,r){console.error("sendTrack:",e,r)}};function K(t){return t?.rootDir!==void 0}function _(t){return t?.schema!==
void 0}async function Q(t,e){let r,i={},n;if(K(e))if(n=e.rootDir,r={resolveRelativePath:(a,o)=>m.join(e.rootDir,m.dirname(
o),a)},e.schemaMapping)i=e.schemaMapping;else{let a=m.join(e.rootDir,".vscode","settings.json");v.existsSync(a)&&(i=k(a)["\
yaml.schemas"])}else _(e)&&(i={[e.schema]:"*"},r={resolveRelativePath:(a,o)=>m.join(m.dirname(o),a)});let s=new T.YAMLSchemaService(
L(n),r);for(let a in i){s.addSchemaPriority(a,0);let o=i[a];o instanceof Array||(o=[o]),s.registerExternalSchema(a,o)}let p=new P,
l=new Y.YAMLValidation(s,p);l.configure({validate:!0,yamlVersion:e?.yamlVersion??"1.2",disableAdditionalProperties:!1,customTags:[]});
let f=new F.YAMLHover(s,p);return await Promise.all(t.map(async a=>{let o=n?m.join(n,a):a,h=m.resolve(o),d=D.TextDocument.
create(h,"yaml",0,v.readFileSync(o).toString()),w=await l.doValidation(d),B=await Promise.all(w.map(y=>f.doHover(d,y.range.
start)));return{filePath:o,error:w.map((y,E)=>({diag:y,hover:B[E]}))}})).then(a=>a.filter(o=>o.error.length>0))}async function X(t,e){
console.log(`Validating ${t.length} YAML files.`);let r=await Q(t,e);if(r.length==0){console.log("Validation complete.");
return}console.error("Found invalid files:");for(let i of r)for(let n of i.error){let{diag:s}=n,p=s.source?` ${s.source}`:
"";console.error(`${i.filePath}:${s.range.start.line+1}:${s.range.start.character+1}: ${s.message}${p}`)}return r}async function H(t,e,r,i){
console.log(`Looking for YAML files to validate at: ${e}`);let n=await(0,j.glob)("**/*.{yml,yaml}",{cwd:e,nodir:!0,dot:!0,
ignore:r});return X(n,{...t,rootDir:e,schemaMapping:i})}var b=require("vscode-languageserver-types"),M=require("marked"),U=require("marked-terminal");async function Z(){M.marked.
use((0,U.markedTerminal)());let t=process.env.GITHUB_WORKSPACE,e=c.getInput("root",{trimWhitespace:!0});e&&(t=I.resolve(
t,e));let r,i=c.getInput("schemaMapping");i&&(r=JSON.parse(i),console.log("Using schema mapping:",r));let n=c.getInput("\
yamlVersion"),s=n==""?void 0:n;s&&console.log("Using YAML specification version:",s);let p=c.getMultilineInput("excluded\
Files",{trimWhitespace:!0}),l=await H({yamlVersion:s},t,p,r);if(l&&l.length>0){for(let f of l)for(let a of f.error){let{
diag:o,hover:h}=a,d=h&&b.MarkupContent.is(h.contents)?`

${(0,M.marked)(h.contents.value,{gfm:!1})}`:"";c.error(o.message+d,{title:`${o.message}${o.source?" "+o.source+".":""}`,
file:f.filePath,startLine:o.range.start.line+1,endLine:o.range.end.line+1,startColumn:o.range.start.character,endColumn:o.
range.end.character})}c.setFailed(`${l.length} file(s) failed validation`),c.setOutput("invalidFiles",l.map(f=>f.filePath))}}
try{Z()}catch(t){c.setFailed(t.message)}
