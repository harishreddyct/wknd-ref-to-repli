/*
 * Authoring shape: one row per profile — [photo] [name / role / social links].
 * The social cell holds one paragraph with the person's placeholder social
 * links; decorate() turns them into the reference's row of square icon
 * buttons, using the project's generic (non-brand) social glyph and a
 * generic accessible name rather than naming a specific platform — see
 * docs/component-registry.md's social-icon note.
 */
function decorateSocial(cell) {
  const links = [...cell.querySelectorAll('a')];
  if (!links.length) return;
  const name = cell.querySelector('h3')?.textContent.trim() || 'WKND';
  const anchorParent = links[0].closest('p') || links[0].parentElement;

  const list = document.createElement('ul');
  list.className = 'team-member-social';
  links.forEach((a) => {
    // a.className reset also drops any button classes decorateButtons() added
    a.className = 'team-member-social-link';
    a.setAttribute('aria-label', `Follow ${name} (placeholder link)`);
    a.textContent = '';
    const img = document.createElement('img');
    img.className = 'team-member-social-icon';
    img.src = '/icons/social.svg';
    img.alt = '';
    img.loading = 'lazy';
    a.append(img);
    const li = document.createElement('li');
    li.append(a);
    list.append(li);
  });

  anchorParent.replaceWith(list);
}

export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('team-member');
    [...row.children].forEach((cell) => {
      if (cell.querySelector('picture, img')) {
        cell.classList.add('team-member-photo');
      } else {
        cell.classList.add('team-member-body');
        decorateSocial(cell);
      }
    });
  });
}
