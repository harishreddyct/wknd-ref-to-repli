/*
 * Authoring shape: one row per tab — [label] [panel content].
 * Implements the standard ARIA tabs pattern (roving tabindex, arrow-key
 * navigation) — genuinely needs JS for correct keyboard/screen-reader
 * behavior, unlike most blocks in this project.
 */
function selectTab(tablist, panels, index) {
  const tabButtons = [...tablist.children];
  tabButtons.forEach((btn, i) => {
    const active = i === index;
    btn.setAttribute('aria-selected', active ? 'true' : 'false');
    btn.tabIndex = active ? 0 : -1;
    panels[i].hidden = !active;
  });
  tabButtons[index].focus();
}

export default function decorate(block) {
  const rows = [...block.children];
  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');

  const panelWrapper = document.createElement('div');
  panelWrapper.className = 'tabs-panels';

  const panels = rows.map((row, i) => {
    const [labelCell, panelCell] = [...row.children];
    const id = `tab-${Math.random().toString(36).slice(2, 8)}-${i}`;

    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'tabs-tab';
    tab.id = `${id}-tab`;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    tab.setAttribute('aria-controls', `${id}-panel`);
    tab.tabIndex = i === 0 ? 0 : -1;
    tab.textContent = labelCell.textContent.trim();
    tab.addEventListener('click', () => selectTab(tablist, panels, i));
    tablist.append(tab);

    panelCell.className = 'tabs-panel';
    panelCell.id = `${id}-panel`;
    panelCell.setAttribute('role', 'tabpanel');
    panelCell.setAttribute('aria-labelledby', tab.id);
    panelCell.hidden = i !== 0;
    panelWrapper.append(panelCell);
    return panelCell;
  });

  tablist.addEventListener('keydown', (e) => {
    const current = [...tablist.children].indexOf(document.activeElement);
    if (current === -1) return;
    if (e.key === 'ArrowRight') selectTab(tablist, panels, (current + 1) % panels.length);
    if (e.key === 'ArrowLeft') selectTab(tablist, panels, (current - 1 + panels.length) % panels.length);
  });

  block.textContent = '';
  block.append(tablist, panelWrapper);
}
