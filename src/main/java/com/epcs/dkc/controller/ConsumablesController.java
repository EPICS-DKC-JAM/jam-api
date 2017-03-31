package com.epcs.dkc.controller;

import com.epcs.dkc.data.Communicator;
import com.epcs.dkc.data.Consumables;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Created by shane on 3/31/17.
 */

@Controller
@RequestMapping("/consumables")
public class ConsumablesController {

    @Autowired
    private Communicator dataCommunicator;

    @GetMapping(path="/all")
    public @ResponseBody Iterable<Consumables> getAllConsumables() {
        return dataCommunicator.getAllConsumables();
    }

    @GetMapping(path="/getByName")
    public @ResponseBody Consumables getByName(@RequestParam String name) {
        return dataCommunicator.getConsumableByName(name);
    }

    @GetMapping(path="/getById")
    public @ResponseBody Consumables getById(@RequestParam int id) {
        return dataCommunicator.getConsumableById(id);
    }

    @GetMapping(path="/update")
    public @ResponseBody String update(@RequestParam int id, @RequestParam String name, @RequestParam String description,
                                     @RequestParam double price, @RequestParam int modifier_id, @RequestParam int size_id) {
        Consumables consumable = new Consumables();
        consumable.setName(name);
        consumable.setDescription(description);
        consumable.setPrice(price);
        consumable.setModifier_id(modifier_id);
        consumable.setSize_id(size_id);

        return dataCommunicator.updateConsumable(consumable);
    }
}
