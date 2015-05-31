angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("features/home/_home.html","<div class=\"wrapper center\">\n  <a class=\"button\" ui-sref=\"write\">{{user.latest?\'Continue writing\':\'Start writing\'}}</a>\n  <ul>\n    <li ng-if=\"!!stream\" ng-repeat=\"stream in user.streams\">\n      <h2>\n        {{stream.title}}\n      </h2>\n      <p>\n        {{stream.completed | amCalendar}}\n      </p>\n    </li>\n  </ul>\n</div>\n");
$templateCache.put("features/_feature/_feature.html","\n");
$templateCache.put("features/stream/_stream.html","\n");
$templateCache.put("features/login/_login.html","<div class=\"wrapper center\">\n  <a class=\"button\" ng-click=\"login()\">Login with Twitter</a>\n</div>\n");
$templateCache.put("features/title/_title.html","<div class=\"wrapper\">\n  <input autofocus=\"true\" ng-model=\"title\" placeholder=\"untitled\" type=\"text\" />\n</div>\n<div class=\"wrapper dark\">\n  <a class=\"button\" ui-sref=\"write\">Back</a>\n  <div class=\"stream-actions\">\n    <a class=\"button\" ng-click=\"save()\">{{saving?\'Saving...\':\'Done\'}}</a>\n  </div>\n</div>\n");
$templateCache.put("features/write/_write.html","<div class=\"wrapper\">\n  <p class=\"faded\">\n    {{prev}}\n  </p>\n  <textarea autofocus=\"\" ng-change=\"updateWords()\" ng-focus=\"abandon_confirm=false; complete_confirm=false\" ng-model=\"stream.writing\" ng-paste=\"preventPaste($event)\" overflow=\"stream.written\" placeholder=\"Just write it down\" previousLine=\"prev\"></textarea>\n  <div class=\"stream-actions\">\n    <a class=\"button minor\" id=\"abandon\" ng-click=\"abandon()\">{{abandon_confirm?\'Sure?\':\'Abandon\'}}</a><a class=\"button\" id=\"confirm\" ng-class=\"{&#39;disabled&#39;: !words}\" ng-click=\"complete()\">Complete</a>\n  </div>\n  <div class=\"stream-meta center\">\n    <div class=\"left\">\n      <span>{{words}} </span><ng-pluralize class=\"faded\" count=\"words\" when=\"{&#39;one&#39;: &#39;word&#39;, &#39;other&#39;: &#39;words&#39;}\"></ng-pluralize>\n    </div>\n    <span class=\"faded right\"> {{created | amCalendar}}</span>\n  </div>\n</div>\n");
$templateCache.put("patterns/_pattern/_pattern.html","");}]);