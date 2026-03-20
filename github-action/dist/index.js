import*as c from"@actions/core";import*as C from"path";import*as u from"fs";import*as m from"path";import{YAMLSchemaService as F}from"yaml-language-server/out/server/src/languageservice/services/yamlSchemaService";
import{YAMLValidation as D}from"yaml-language-server/out/server/src/languageservice/services/yamlValidation";import{YAMLHover as j}from"yaml-language-server/out/server/src/languageservice/services/yamlHover";
import{TextDocument as H}from"vscode-languageserver-textdocument";import*as M from"fs";import*as d from"path";import{URI as P}from"vscode-uri";function w(t,e){let r=0;for(;r<t.length&&t[r]===
e;)++r;return r>0?t.substring(r):t}var R=(t,e)=>t?P.file(d.join(t,P.parse(e).fsPath)).toString():d.normalize(e);function V(t){
return JSON.parse(M.readFileSync(t).toString())}import*as $ from"fs";import{URI as v}from"vscode-uri";import{isRelativePath as Y}from"yaml-language-server/out/server/src/languageservice/utils/paths";function W(t){return async e=>{if(!e)return Promise.reject("No schema specified");t&&Y(e)&&(e=R(t,e));let r=v.parse(e).scheme.
toLowerCase();if(/^[a-z]:[\\/]/i.test(e)){let a=v.file(e);r=a.scheme.toLowerCase(),e=a.toString()}if(r==="file")return new Promise(
(a,s)=>{let p=w(v.parse(e).fsPath,"\\");$.readFile(p,(l,f)=>(l&&console.error(`Could not find schema file at: ${p}`),l?s(
""):a(f.toString())))});let n=await fetch(e);return n.ok?n.text():Promise.reject(`Unable to load schema at ${e}: ${n.statusText}`)}}import{glob as I}from"glob";var y=class{constructor(){}send(e){console.error("send:",e)}sendError(e,r){console.error("se\
ndError:",e,r)}sendTrack(e,r){console.error("sendTrack:",e,r)}};function b(t){return t?.rootDir!==void 0}function U(t){return t?.
schema!==void 0}async function B(t,e){let r,n={},a;if(b(e))if(a=e.rootDir,r={resolveRelativePath:(i,o)=>m.join(e.rootDir,
m.dirname(o),i)},e.schemaMapping)n=e.schemaMapping;else{let i=m.join(e.rootDir,".vscode","settings.json");u.existsSync(i)&&
(n=V(i)["yaml.schemas"])}else U(e)&&(n={[e.schema]:"*"},r={resolveRelativePath:(i,o)=>m.join(m.dirname(o),i)});let s=new F(
W(a),r);for(let i in n){s.addSchemaPriority(i,0);let o=n[i];o instanceof Array||(o=[o]),s.registerExternalSchema(i,o)}let p=new y,
l=new D(s,p);l.configure({validate:!0,yamlVersion:e?.yamlVersion??"1.2",disableAdditionalProperties:!1,customTags:[]});let f=new j(
s,p);return await Promise.all(t.map(async i=>{let o=a?m.join(a,i):i,g=m.resolve(o),h=H.create(g,"yaml",0,u.readFileSync(
o).toString()),x=await l.doValidation(h),L=await Promise.all(x.map(S=>f.doHover(h,S.range.start)));return{filePath:o,error:x.
map((S,T)=>({diag:S,hover:L[T]}))}})).then(i=>i.filter(o=>o.error.length>0))}async function E(t,e){console.log(`Validati\
ng ${t.length} YAML files.`);let r=await B(t,e);if(r.length==0){console.log("Validation complete.");return}console.error(
"Found invalid files:");for(let n of r)for(let a of n.error){let{diag:s}=a,p=s.source?` ${s.source}`:"";console.error(`${n.
filePath}:${s.range.start.line+1}:${s.range.start.character+1}: ${s.message}${p}`)}return r}async function k(t,e,r,n){console.
log(`Looking for YAML files to validate at: ${e}`);let a=await I("**/*.{yml,yaml}",{cwd:e,nodir:!0,dot:!0,ignore:r});return E(
a,{...t,rootDir:e,schemaMapping:n})}import{MarkupContent as O}from"vscode-languageserver-types";import{marked as A}from"marked";import{markedTerminal as q}from"marked-terminal";
async function J(){A.use(q());let t=process.env.GITHUB_WORKSPACE,e=c.getInput("root",{trimWhitespace:!0});e&&(t=C.resolve(
t,e));let r,n=c.getInput("schemaMapping");n&&(r=JSON.parse(n),console.log("Using schema mapping:",r));let a=c.getInput("\
yamlVersion"),s=a==""?void 0:a;s&&console.log("Using YAML specification version:",s);let p=c.getMultilineInput("excluded\
Files",{trimWhitespace:!0}),l=await k({yamlVersion:s},t,p,r);if(l&&l.length>0){for(let f of l)for(let i of f.error){let{
diag:o,hover:g}=i,h=g&&O.is(g.contents)?`

${A(g.contents.value,{gfm:!1})}`:"";c.error(o.message+h,{title:`${o.message}${o.source?" "+o.source+".":""}`,file:f.filePath,
startLine:o.range.start.line+1,endLine:o.range.end.line+1,startColumn:o.range.start.character,endColumn:o.range.end.character})}
c.setFailed(`${l.length} file(s) failed validation`),c.setOutput("invalidFiles",l.map(f=>f.filePath))}}try{J()}catch(t){
c.setFailed(t.message)}
