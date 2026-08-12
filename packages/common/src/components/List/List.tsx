import React from "react";

type ListItemProps = {
  id?: string;
  leadingElement?: React.ReactNode;
  avatarImageURL?: string;
  title: React.ReactNode;
  checked?: boolean;
  subtitle?: React.ReactNode;
  trailingElement?: React.ReactNode;
  data?: unknown;
};

type ListProps = {
  compact?: boolean;
  selectable?: boolean;
  onPrimaryAction?: (item: ListItemProps) => void;
  onSecondaryAction?: (item: ListItemProps) => void;
  onSelectionChanged?: (item: ListItemProps) => void;
  onClick?: (item: ListItemProps) => void;
  items: Array<ListItemProps>;
};

export function List(props: ListProps) {
  const {
    items,
    selectable,
    onSecondaryAction,
    onSelectionChanged,
    onClick,
    compact,
  } = props;

  const handleClick = (item: ListItemProps) => {
    if (onClick) {
      onClick(item);
    }
  };

  const handleSelectionChanged = (item: ListItemProps) => {
    if (onSelectionChanged) {
      onSelectionChanged(item);
    }
  };

  const handleSecondaryAction = (item: ListItemProps) => {
    if (onSecondaryAction) {
      onSecondaryAction(item);
    }
  };

  return (
    <ul className={["menu w-full max-w-sm bg-transparent", compact ? "menu-sm" : ""].join(" ")}>
      {items.map((item, index) => {
        const labelId = `checkbox-list-label-${item.id ?? index}`;

        return (
          <li key={item.id || index}>
            <div className="flex items-center gap-3">
              {selectable && (
                <input
                  type="checkbox"
                  checked={Boolean(item.checked)}
                  tabIndex={-1}
                  aria-labelledby={labelId}
                  className="checkbox checkbox-primary checkbox-sm"
                  onChange={() => handleSelectionChanged(item)}
                />
              )}
              {item.leadingElement}
              {item.avatarImageURL && (
                <div className="avatar">
                  <div className="h-10 w-10 rounded-full">
                    <img
                      alt={`Avatar for ${String(item.title)}`}
                      src={item.avatarImageURL}
                    />
                  </div>
                </div>
              )}
              <button
                type="button"
                className="flex min-w-0 flex-1 flex-col items-start text-left"
                id={labelId}
                onClick={() => handleClick(item)}
              >
                <span className="truncate font-medium">{item.title}</span>
                {item.subtitle && (
                  <span className="truncate text-xs text-base-content/60">
                    {item.subtitle}
                  </span>
                )}
              </button>
              {item.trailingElement && (
                <button
                  type="button"
                  className="btn btn-ghost btn-square btn-sm"
                  onClick={() => handleSecondaryAction(item)}
                >
                  {item.trailingElement}
                </button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
