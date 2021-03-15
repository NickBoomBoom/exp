---
title: TypeScript 
---

## tsconfig.json 详解
::: tip
[官方指南](https://www.tslang.cn/docs/handbook/compiler-options.html)
:::

初始化一个tsconfig.json配置文件tsc --init

默认的配置如下，只配置了四个关键参数，target/module/strict、esModuleInterop，其他的都注释掉了。

target默认是es5，如果你的代码中有一些es6的语法，如：Object.assign，编辑器可能会报错，所有可以修改为es6(es2015).

module默认commonjs。如果代码报错，可以改成es2015或者其他模式。

strict默认true，严格模式，这个应该影响最大，很多从js迁移过来的代码都不符合ts规范，所以最好关闭严格模式，等以后代码规范了在开启，在编辑的时候就发现很多错误，从而在某些方面提高开发效率。

esModuleInterop :不懂。
```js
{
  "compilerOptions": {
    /* Basic Options */
    "target": "es5",                          /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017','ES2018' or 'ESNEXT'. */
    "module": "commonjs",                     /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', or 'ESNext'. */
    // "lib": [],                             /* Specify library files to be included in the compilation. */
    // "allowJs": true,                       /* Allow javascript files to be compiled. */
    // "checkJs": true,                       /* Report errors in .js files. */
    // "jsx": "preserve",                     /* Specify JSX code generation: 'preserve', 'react-native', or 'react'. */
    // "declaration": true,                   /* Generates corresponding '.d.ts' file. */
    // "declarationMap": true,                /* Generates a sourcemap for each corresponding '.d.ts' file. */
    // "sourceMap": true,                     /* Generates corresponding '.map' file. */
    // "outFile": "./",                       /* Concatenate and emit output to single file. */
    // "outDir": "./",                        /* Redirect output structure to the directory. */
    // "rootDir": "./",                       /* Specify the root directory of input files. Use to control the output directory structure with --outDir. */
    // "composite": true,                     /* Enable project compilation */
    // "removeComments": true,                /* Do not emit comments to output. */
    // "noEmit": true,                        /* Do not emit outputs. */
    // "importHelpers": true,                 /* Import emit helpers from 'tslib'. */
    // "downlevelIteration": true,            /* Provide full support for iterables in 'for-of', spread, and destructuring when targeting 'ES5' or 'ES3'. */
    // "isolatedModules": true,               /* Transpile each file as a separate module (similar to 'ts.transpileModule'). */

    /* Strict Type-Checking Options */
    "strict": true,                           /* Enable all strict type-checking options. */
    // "noImplicitAny": true,                 /* Raise error on expressions and declarations with an implied 'any' type. */
    // "strictNullChecks": true,              /* Enable strict null checks. */
    // "strictFunctionTypes": true,           /* Enable strict checking of function types. */
    // "strictPropertyInitialization": true,  /* Enable strict checking of property initialization in classes. */
    // "noImplicitThis": true,                /* Raise error on 'this' expressions with an implied 'any' type. */
    // "alwaysStrict": true,                  /* Parse in strict mode and emit "use strict" for each source file. */

    /* Additional Checks */
    // "noUnusedLocals": true,                /* Report errors on unused locals. */
    // "noUnusedParameters": true,            /* Report errors on unused parameters. */
    // "noImplicitReturns": true,             /* Report error when not all code paths in function return a value. */
    // "noFallthroughCasesInSwitch": true,    /* Report errors for fallthrough cases in switch statement. */

    /* Module Resolution Options */
    // "moduleResolution": "node",            /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). */
    // "baseUrl": "./",                       /* Base directory to resolve non-absolute module names. */
    // "paths": {},                           /* A series of entries which re-map imports to lookup locations relative to the 'baseUrl'. */
    // "rootDirs": [],                        /* List of root folders whose combined content represents the structure of the project at runtime. */
    // "typeRoots": [],                       /* List of folders to include type definitions from. */
    // "types": [],                           /* Type declaration files to be included in compilation. */
    // "allowSyntheticDefaultImports": true,  /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */
    "esModuleInterop": true                   /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */
    // "preserveSymlinks": true,              /* Do not resolve the real path of symlinks. */

    /* Source Map Options */
    // "sourceRoot": "",                      /* Specify the location where debugger should locate TypeScript files instead of source locations. */
    // "mapRoot": "",                         /* Specify the location where debugger should locate map files instead of generated locations. */
    // "inlineSourceMap": true,               /* Emit a single file with source maps instead of having a separate file. */
    // "inlineSources": true,                 /* Emit the source alongside the sourcemaps within a single file; requires '--inlineSourceMap' or '--sourceMap' to be set. */

    /* Experimental Options */
    // "experimentalDecorators": true,        /* Enables experimental support for ES7 decorators. */
    // "emitDecoratorMetadata": true,         /* Enables experimental support for emitting type metadata for decorators. */
  }
}

```



### compilerOptions配置说明

  #### 基本选项

  - “target”:“es5”，/指定ECMAScript目标版本:“ES3”(默认)、“es5”、“ES2015”、“ES2016”、“ES2017”、“ES2018”或“ESNEXT”。 /
  -  “module”:“commonjs”，/指定模块代码生成:“none”、“commonjs”、“amd”、“system”、“umd”、“es2015”或“ESNext”。 /
  -  “lib”:[]， /指定要包含在编译中的库文件。 /
  -  “allowJs”:true， /允许编译javascript文件。 /
  -  “checkJs”: true， /报告.js文件中的错误。 /
  -  “jsx”:“preserve”，/指定jsx代码生成:“preserve”、“response -native”或“react”。 /
  -  “declaration”: true， /生成对应的’.d。ts文件。 /
  -  "declaration ationmap ": true， /为每个对应的’.d '生成一个sourcemap。ts文件。 /
  -  “sourceMap”: true， /生成相应的’。地图的文件。 /
  -  :“outFile。/"， /连接并将输出发送到单个文件。 /
  -  “outDir”:”。/"， /将输出结构重定向到目录。 /
  -  “rootDir”:”。/"， /指定输入文件的根目录。用于用——outDir控制输出目录结构。 /
  -  “composite”: true， /启用项目编译/
  -  “removeComments”:true， /不向输出发出注释。 /
  -  “noEmit”:true， /不发出输出。 /
  -  “importthelpers”:true， /* Import从“tslib”中释放助手。* /
  -  “downlevelIteration”:true， /当目标为“ES5”或“ES3”时，为“for-of”、“spread”和“destructuring”中的迭代提供完全支持。 /
  -  “isolatedModules”:true， /将每个文件转换为一个单独的模块(类似于“ts.transpileModule”)。 /

##### 严格的类型检查选项

- “strict”:true， /启用所有严格的类型检查选项。 /
- “noImplicitAny”:true， /对隐含的“any”类型的表达式和声明提出错误。 /
- “strictnullcheck”:true， /启用严格的空检查。 /
- “strictFunctionTypes”: true， /启用对函数类型的严格检查。 /
- " strictpropertyinitialized ": true， /在类中启用严格的属性初始化检查。 /
- “noImplicitThis”:true， /对包含“any”类型的“this”表达式提出错误。 /
- “always sstrict”:true， /在strict模式下解析，并为每个源文件发出“use strict”。 /

#### 附加检查

- “noUnusedLocals”:true， /报告未使用局部变量的错误。 /
- “noUnusedParameters”:true， /报告未使用参数的错误。 /
- “noImplicitReturns”:true， /当函数中并非所有代码路径都返回值时报告错误。 /
- “noFallthroughCasesInSwitch”:true， /在switch语句中报告错误。 /
模块解析选项
- “moduleResolution”:“node”，/指定模块解析策略:“node”(node .js)或“classic”(TypeScript pre-1.6)。 /
- “baseUrl”:”。/"， /基本目录来解析非绝对模块名。 /
- “path”:{}，/一系列条目，这些条目将导入重新映射到相对于“baseUrl”的查找位置。 /
- “rootDirs”:[]，/根文件夹列表，其组合内容表示运行时项目的结构。 /
- “typeRoots”:[]， /包含类型定义的文件夹列表。 /
- “types”:[]， /编译中包含的类型声明文件。 /
- “allowSyntheticDefaultImports”:true， /允许从没有默认导出的模块进行默认导入。这并不影响代码发出，只影响类型查询。 /
- “esModuleInterop”:true /通过为所有导入创建名称空间对象，支持CommonJS和ES模块之间的互操作性。意味着“allowSyntheticDefaultImports”。 /
- “preserveSymlinks”:true， /不解析符号链接的实际路径。 /

#### 源映射选项
- “sourceRoot”: “”， /指定调试器应该定位TypeScript文件而不是源位置的位置。 /
- “mapRoot”: “”， /指定调试器应该定位映射文件的位置，而不是生成的位置。 /
- “inlineSourceMap”: true， /发出一个带有源映射的文件，而不是一个单独的文件。 /
- “inlineSources”:true， /*在单个文件中，将源文件与源文件一起发出;需要设置’- inlineSourceMap’或’- sourceMap’ . */

#### 实验选项
- "experimental entaldecorator ": true， /支持对ES7 decorator的实验支持。 /
- “emitDecoratorMetadata”:true， /启用了对为decorator发出类型元数据的实验性支持。 /
