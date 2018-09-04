import { IEditSession, acequire } from 'brace';
const Range = acequire( 'ace/range' ).Range;

export interface MarkerConfig {
    characterWidth: number;
    firstRow: number;
    firstRowScreen: number;
    height: number;
    lastRow: number;
    lineHeight: number;
    maxHeight: number;
    minHeight: number;
    offset: number;
    padding: number;
    width: number;
}

export class PersonMarker {
    update( stringBuilder: string[], markerLayer: any, session: IEditSession, config: MarkerConfig ) {
        for ( let rowIdx = config.firstRow; rowIdx <= config.lastRow; ++rowIdx ) {
            const rowTokens = session.getTokens( rowIdx );
            const typeIdx = rowTokens.findIndex( ( t: any ) => t.type === 'string' && t.value === '"person"' );

            if ( typeIdx > -1 ) {
                const offset = tokenLineOffset( rowTokens, typeIdx );
                const range = new Range( rowIdx, offset, rowIdx, offset + rowTokens[ typeIdx ].value.length );

                // markerLayer.drawSingleLineMarker( stringBuilder, range, 'person-marker', config );

                const backwardVisitor = backwardTokenVisitor( session, rowIdx, typeIdx );
                const forwardVisitor = forwardTokenVisitor( session, rowIdx, typeIdx );

                let startPos = null;
                backwardVisitor( ( token, rIdx, tIdx ) => {
                    if ( token.type === 'paren.lparen' ) {
                        startPos = {
                            row: rIdx,
                            token: tIdx
                        };
                        return true;
                    }
                } );

                if ( !!startPos ) {
                    const sOffset = tokenLineOffset( session.getTokens( startPos.row ), startPos.token );
                    const sRange = new Range( startPos.row, sOffset - 1, startPos.row, sOffset );
                    console.log( 'Marker at: ', sRange );
                    // markerLayer.drawSingleLineMarker( stringBuilder, sRange, 'person-marker', config );


                    let endPos = null;
                    forwardVisitor( ( token, rIdx, tIdx ) => {
                        if ( token.type === 'paren.rparen' ) {
                            endPos = {
                                row: rIdx,
                                token: tIdx
                            };
                            return true;
                        }
                    } );

                    const eOffset = tokenLineOffset( session.getTokens( endPos.row ), endPos.token );
                    if ( endPos ) {
                        const fullRange = new Range( startPos.row, sOffset - 1, endPos.row, eOffset + 1 );
                        const personText = session.getTextRange( fullRange );
                        console.log( 'Person: ', JSON.parse( personText ) );
                        // markerLayer.drawMultiLineMarker( stringBuilder, fullRange, 'person-marker', config );
                        for ( let l = startPos.row + 1; l < endPos.row; ++l ) {
                            const line = session.getLine( l );

                            let lineStart = line.indexOf( '"' );

                            markerLayer.drawSingleLineMarker( stringBuilder, new Range( l, lineStart, l, line.length ), 'person-marker', config );
                        }
                    }
                }
            }
        }
    }
}

function backwardTokenVisitor( session: IEditSession, rowIdx: number, tokenIdx: number ) {
    return ( visit: ( token: any, rIdx?: number, tIdx?: number ) => boolean | void ) => {
        let tokens: any[];
        tokens = session.getTokens( rowIdx );
        for ( let t = tokenIdx - 1; t >= 0; --t ) {
            if ( !!visit( tokens[ t ], rowIdx, t ) )
                return;
        }
        for ( let r = rowIdx - 1; r >= 0; --r ) {
            tokens = session.getTokens( r );
            for ( let t = tokens.length; t >= 0; --t ) {
                if ( !!visit( tokens[ t - 1 ], r, t ) )
                    return;
            }
        }
    }
}

function forwardTokenVisitor( session: IEditSession, rowIdx: number, tokenIdx: number ) {
    return ( visit: ( token: any, rIdx?: number, tIdx?: number ) => boolean | void ) => {
        let tokens: any[];
        tokens = session.getTokens( rowIdx );
        for ( let t = tokenIdx + 1; t < tokens.length; ++t ) {
            if ( !!visit( tokens[ t ], rowIdx, t ) )
                return;
        }
        for ( let r = rowIdx + 1; r < session.doc.getLength(); ++r ) {
            tokens = session.getTokens( r );
            for ( let t = 0; t < tokens.length; ++t ) {
                if ( !!visit( tokens[ t ], r, t ) )
                    return;
            }
        }
    }
}

function tokenLineOffset( tokens: any[], tokenIdx: number ) {
    let idx = tokenIdx;
    let offset = 0;

    while ( idx ) offset += tokens[ --idx ].value.length;

    return offset;
}
