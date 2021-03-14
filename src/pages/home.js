import React from 'react';
import { useQuery, gql } from '@apollo/client';
import ReactMarkdown from 'react-markdown';

import Header from '../components/Header';
import Navigation from '../components/Navigation';
import NoteFeed from '../components/NoteFeed';

const GET_NOTES = gql`
    query NoteFeed($cursor: String) {
        noteFeed(cursor: $cursor) {
        cursor
        hasNextPage
        notes {
            id
            createdAt
            content
            favoriteCount
            author {
                username
                id
                avatar
            }
        }
        }
    }
`;

const Home = () => {
    const { data, loading, error, fetchMore } = useQuery(GET_NOTES);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error!</p>;

    return (
        <div>
            <Header />
            <Navigation />
            <NoteFeed notes={data.noteFeed.notes} />
            {data.noteFeed.hasNextPage && (
                <button
                    onClick={() => 
                        fetchMore({
                            variables: {
                                cursor: data.noteFeed.cursor
                            },
                            updateQuery: (previousResult, { fetchMoreResult }) => {
                                return {
                                    noteFeed: {
                                        cursor: fetchMoreResult.noteFeed.cursor,
                                        hasNextPage: fetchMoreResult.noteFeed.hasNextPage,
                                        notes: [
                                            ...previousResult.noteFeed.notes,
                                            ...fetchMoreResult.noteFeed.notes
                                        ],
                                        _typename: 'noteFeed'
                                    }
                                }
                            }
                        })}
                        >Load More</button>
            )}
        </div>
    )
}

export default Home;