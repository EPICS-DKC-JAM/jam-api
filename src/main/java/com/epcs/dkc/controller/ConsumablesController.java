package com.epcs.dkc.controller;

import com.epcs.dkc.data.Communicator;
import com.epcs.dkc.data.Consumables;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

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
    public @ResponseBody String update(@ModelAttribute Consumables consumable) {
        return dataCommunicator.updateConsumable(consumable);
    }
}
