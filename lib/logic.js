/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";
/**
 * Write your transction processor functions here
 */

/**
 * Sample transaction
 * @param {model.Donate} donate
 * @transaction
 */
async function Donation(donate) {
  // Save the old value of the asset.
  let Balance = donate.project.Balance;
  // Save The Amount that projects needs
  const ProjectNeeds = donate.project.foundsNeeded;
  // Get the project condition
  let projectCondition = donate.project.needsDonate;

  if (projectCondition === true) {
    // Update the asset with the new value.
    let newBalance = Balance + donate.value;
    Balance = newBalance;
    if (Balance == ProjectNeeds) {
      projectCondition = false;
      return projectCondition;
    }else {
      donate.project.details = "Completed";
    }
    return Balance;
  } else {
    donate.project.details = "Can't donate, The project is Full Donate";
  }

  // Get the asset registry for the asset.
  const assetRegistry = await getAssetRegistry("model.Project");
  // Update the asset in the asset registry.
  await assetRegistry.update(donate.project);

  // Emit an event for the modified asset.
  let event = getFactory().newEvent("model", "SampleEvent");
  event.asset = donate.asset;
  event.oldValue = Balance;
  event.newValue = newBalance;
  emit(event);
}

/**
 * Remove all high volume commodities
 * @param {model.removeProjectsByNeedsCondition} remove - the remove to be processed
 * @transaction
 */
async function removecompletedProjects(remove) {
  // eslint-disable-line no-unused-vars

  const assetRegistry = await getAssetRegistry("model.Project");
  const results = await query("selectDoneProjects");

  // since all registry requests have to be serialized anyway, there is no benefit to calling Promise.all
  // on an array of promises
  results.forEach(async (donate) => {
    const removeNotification = getFactory().newEvent(
      "model",
      "RemoveNotification"
    );
    removeNotification.project = remove;
    emit(removeNotification);
    await assetRegistry.remove(donate);
  });
}
