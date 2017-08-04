const default_template = '(Build ${AppBuildID})';
let enable_custom_title = false;
let custom_template = '';
let $checkbox;
let $input;
let $tbody;

/**
 * Initialize the option view.
 */
const init_view = async () => {
  $checkbox = document.querySelector('#enable_custom_title');
  $input = document.querySelector('#custom_template');
  $tbody = document.querySelector('#variable_tbody');

  $checkbox.addEventListener('change', event => update_title());
  $input.addEventListener('input', event => update_title());

  try {
    const pref = await browser.storage.local.get();

    $checkbox.checked = enable_custom_title = pref.enable_custom_title || false;
    $input.value = custom_template = pref.custom_template || default_template;
  } catch (ex) {}

  for (const [key, value] of Object.entries(await get_variable_values())) {
    const $row = $tbody.insertRow();
    const $cell_key = $row.insertCell();
    const $cell_desc = $row.insertCell();
    const $cell_value = $row.insertCell();

    $row.addEventListener('click', event => {
      $input.value += ' ${' + key + '}';
      update_title();
    });

    $cell_key.textContent = key;
    $cell_desc.textContent = browser.i18n.getMessage(`variable_${key}`);
    $cell_value.textContent = value || '(unknown)';
  }
};

/**
 * Save the preference and update the window title bar in background.
 */
const update_title = async () => {
  enable_custom_title = $checkbox.checked;
  custom_template = $input.value;

  try {
    await browser.storage.local.set({ enable_custom_title, custom_template });
  } catch (ex) {}
};

window.addEventListener('DOMContentLoaded', async event => {
  localize_view();
  init_view();
});
