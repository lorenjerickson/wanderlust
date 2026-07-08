import * as React from "react";
import {
  IconChevronDown,
  IconDotsVertical,
  IconHeart,
  IconShare,
} from "@tabler/icons-react";

export function MediaPreview() {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <article className="card max-w-sm bg-base-200 shadow">
      <div className="card-body gap-3">
        <div className="flex items-center gap-3">
          <div className="avatar placeholder">
            <div className="w-10 rounded-full bg-error text-error-content">
              <span>R</span>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold">Shrimp and Chorizo Paella</h3>
            <p className="text-sm text-base-content/60">September 14, 2016</p>
          </div>
          <button type="button" className="btn btn-ghost btn-square btn-sm" aria-label="settings">
            <IconDotsVertical size={18} />
          </button>
        </div>
      </div>
      <figure>
        <img
          className="h-48 w-full object-cover"
          src="/static/images/cards/paella.jpg"
          alt="Paella dish"
        />
      </figure>
      <div className="card-body gap-4">
        <p className="text-sm text-base-content/70">
          This impressive paella is a perfect party dish and a fun meal to cook
          together with your guests. Add 1 cup of frozen peas along with the
          mussels, if you like.
        </p>
        <div className="card-actions items-center">
          <button type="button" className="btn btn-ghost btn-square btn-sm" aria-label="add to favorites">
            <IconHeart size={18} />
          </button>
          <button type="button" className="btn btn-ghost btn-square btn-sm" aria-label="share">
            <IconShare size={18} />
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-square btn-sm ml-auto"
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <IconChevronDown
              size={18}
              className={expanded ? "rotate-180 transition-transform" : "transition-transform"}
            />
          </button>
        </div>
        {expanded && (
          <div className="space-y-3 text-sm text-base-content/80">
            <p className="font-semibold">Method:</p>
            <p>
              Heat 1/2 cup of the broth in a pot until simmering, add saffron
              and set aside for 10 minutes.
            </p>
            <p>
              Heat oil in a large, deep skillet over medium-high heat. Add
              chicken, shrimp and chorizo, and cook until lightly browned.
            </p>
            <p>
              Add rice and stir gently to distribute. Cook until most liquid is
              absorbed, then add reserved shrimp and mussels.
            </p>
            <p>Set aside off of the heat to let rest for 10 minutes, and serve.</p>
          </div>
        )}
      </div>
    </article>
  );
}
