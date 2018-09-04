
export const SCHEMA = new Map<string, any>();
SCHEMA.set( 'complex', {
    name: 'complex',
    type: 'udt',
    properties: [
        {
            name: 'books',
            type: {
                name: 'array',
                itemsType: 'book'
            },
            required: true
        },
        {
            name: 'films',
            type: {
                name: 'array',
                itemsType: 'film'
            },
            required: true
        }
    ]
} );

SCHEMA.set( 'book', {
    name: 'book',
    type: 'udt',
    properties: [
        {
            name: 'title',
            type: 'string',
            required: true
        },
        {
            name: 'isbn',
            type: 'string',
            required: false
        },
        {
            name: 'category',
            type: 'category',
            required: true
        }
    ]
} );


SCHEMA.set( 'category', {
    name: 'category',
    type: 'enum',
    properties: [
        {
            name: 'comedy',
            type: 'string'
        },
        {
            name: 'drama',
            type: 'string'
        },
        {
            name: 'thriller',
            type: 'string'
        }
    ]
} );

SCHEMA.set( 'film',
    {
        name: 'film',
        type: 'udt',
        properties: [
            { name: 'title', type: 'string', required: true },
            { name: 'cast', type: 'cast' }
        ]
    } );

SCHEMA.set( 'cast',
    {
        name: 'cast',
        type: 'udt',
        properties: [
            { name: 'actor', type: 'person', required: true },
            { name: 'as', type: 'string', required: true }
        ]
    } );

SCHEMA.set( 'person', {
    name: 'person',
    type: 'udt',
    properties: [
        { name: 'name', type: 'string', required: true }
    ]
} );