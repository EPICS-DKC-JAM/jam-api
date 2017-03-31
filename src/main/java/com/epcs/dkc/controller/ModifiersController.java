package com.epcs.dkc.controller;

import com.epcs.dkc.data.Communicator;
import com.epcs.dkc.data.Modifiers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

/**
 * Created by shane on 3/31/17.
 */

@Controller
@RequestMapping("/modifiers")
public class ModifiersController {
    @Autowired
    private Communicator dataCommunicator;

    @GetMapping(path="/all")
    public @ResponseBody
    Iterable<Modifiers> getAllModifiers() {
        return dataCommunicator.getAllModifiers();
    }

    @GetMapping(path="/getByName")
    public @ResponseBody Modifiers getByName(@RequestParam String name) {
        return dataCommunicator.getModifierByName(name);
    }

    @GetMapping(path="/getById")
    public @ResponseBody Modifiers getById(@RequestParam int id) {
        return dataCommunicator.getModifierById(id);
    }

    @GetMapping(path="/update")
    public @ResponseBody String update(@ModelAttribute Modifiers modifier) {
        return dataCommunicator.updateModifier(modifier);
    }
}
