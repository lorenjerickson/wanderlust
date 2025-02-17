import React from 'react'
import { StyledList } from './List.styles'

function generate(element: React.ReactElement<unknown>) {
    return [0, 1, 2].map((value) =>
        React.cloneElement(element, {
            key: value,
        })
    )
}

type ListProps = {
    compact: boolean
    items: Array<{
        leadingElement?: React.ReactNode
        title: React.ReactNode
        subtitle?: React.ReactNode
        trailingElement?: React.ReactNode
    }>
}

export function List(props: ListProps) {
    const { items } = props
    return (
        <StyledList>
            <ul>
                {items.map((item) => (
                    <li>
                        {item.leadingElement && (
                            <span>{item.leadingElement}</span>
                        )}
                        <span></span>
                        {item.trailingElement && (
                            <span>{item.trailingElement}</span>
                        )}
                    </li>
                ))}
            </ul>
        </StyledList>
    )
}

export default List
