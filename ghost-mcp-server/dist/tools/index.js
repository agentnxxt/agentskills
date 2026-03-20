import { tools as adminPosts } from "./admin/posts.js";
import { tools as adminPages } from "./admin/pages.js";
import { tools as adminTags } from "./admin/tags.js";
import { tools as adminMembers } from "./admin/members.js";
import { tools as adminTiers } from "./admin/tiers.js";
import { tools as adminNewsletters } from "./admin/newsletters.js";
import { tools as adminOffers } from "./admin/offers.js";
import { tools as adminUsers } from "./admin/users.js";
import { tools as adminImages } from "./admin/images.js";
import { tools as adminThemes } from "./admin/themes.js";
import { tools as adminWebhooks } from "./admin/webhooks.js";
import { tools as adminSite } from "./admin/site.js";
import { tools as contentPosts } from "./content/posts.js";
import { tools as contentPages } from "./content/pages.js";
import { tools as contentTags } from "./content/tags.js";
import { tools as contentAuthors } from "./content/authors.js";
import { tools as contentTiers } from "./content/tiers.js";
export const allTools = [
    ...adminPosts,
    ...adminPages,
    ...adminTags,
    ...adminMembers,
    ...adminTiers,
    ...adminNewsletters,
    ...adminOffers,
    ...adminUsers,
    ...adminImages,
    ...adminThemes,
    ...adminWebhooks,
    ...adminSite,
    ...contentPosts,
    ...contentPages,
    ...contentTags,
    ...contentAuthors,
    ...contentTiers,
];
//# sourceMappingURL=index.js.map