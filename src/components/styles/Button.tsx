import styled from "styled-components";

export const Button = styled.button<{$danger?: boolean}>`
    margin: 5px;
    padding: 6px 8px;
    background-color: ${props => props.$danger ? 'red' : 'darkcyan'};
    color: white;
    font-size: 0.95rem;
    border-radius: 5px;
    border: 2px solid black;
    cursor: pointer;

    &:active {
        background-color: ${props => props.$danger ? 'darkred' : '#0b6464'}
    }
`;