console.info('template {{ name }}!!!')
{{#list}}console.info('{{itemMe}}');{{/list}}
{{^list1}}console.info('{{list1}}'){{/list1}}
{{&html}}