/*
 * Authoring shape: one row per profile — [photo] [name/role/social link].
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('team-member');
    [...row.children].forEach((cell) => {
      cell.classList.add(cell.querySelector('picture, img') ? 'team-member-photo' : 'team-member-body');
    });
  });
}
